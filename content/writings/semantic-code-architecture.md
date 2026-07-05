Modern AI coding assistants are increasingly capable — yet they remain surprisingly shallow. They respond to isolated prompts but fail to reason over how a software system is *actually organised*: which modules depend on which, how execution flows at runtime, where a bug truly originates. This project set out to build infrastructure that allows language models to understand codebases structurally before they attempt to generate or fix code.

## The Problem with Context-Blind Agents

Existing tools like Copilot and Codex operate on whatever text the developer pastes into a prompt. For single-file tasks this works well enough. But real engineering happens across dozens of interdependent files. When a model is unaware that a function in `auth.py` is called by three separate request handlers — and that one of those handlers silently swallows its exceptions — its suggestions will be locally coherent but architecturally wrong.

The root failure is twofold. First, retrieval: the agent cannot find the most relevant code given an ambiguous query. Second, runtime opacity: even when the right code is found, the model has no way to observe what it actually *does* at execution time. This research addresses both problems simultaneously through two integrated subsystems: an advanced Retrieval-Augmented Generation (RAG) library for code intelligence, and a Debugger server exposed through the Model Context Protocol (MCP).

## Retrieval-Augmented Generation for Code

### AST-Based Semantic Chunking

The retrieval subsystem centers on a key insight: code should be chunked along *semantic* boundaries, not arbitrary token windows. Using Python's Abstract Syntax Tree (AST), source files are parsed into function-, class-, and module-aligned chunks that preserve the logical units a developer reasons in. Each chunk carries a stable SHA-256 key derived from its content, path, and span — enabling deduplication and synchronisation across re-indexing cycles without redundant embedding calls.

This approach departs from prior work that applies fixed-size sliding windows (Jain et al., 2022). Fixed windows inevitably split function bodies mid-logic or concatenate unrelated code blocks, degrading the coherence of retrieved context. By contrast, AST-aligned chunks have precise line spans and named identifiers, allowing the retrieval system to report not just which file is relevant but exactly which function or class within it.

For repositories with substantial non-Python code — where AST parsing is unavailable — a metadata-enrichment fallback applies token-budgeted overlapping windows enriched with file path, timestamp, and dependency annotations. Both strategies emit a unified `Chunk` schema, allowing downstream embedding and retrieval components to operate identically regardless of which chunking strategy was applied.

### Hybrid Retrieval and Reranking

Retrieval combines two complementary signals. Dense semantic search via ChromaDB vector embeddings captures *intent*: a query for "how does the login flow work?" retrieves authentication-related code even when the literal word "login" is absent. Lexical BM25 search via SQLite FTS5 captures *precision*: it locates exact symbol names, API signatures, and string literals that semantic embeddings may dilute through generalisation.

This hybrid approach is consistent with the trajectory identified in the retrieval literature. GraphCodeBERT (Guo et al., 2021) and CodeGRAG (Du et al., 2024) demonstrate that structural graph information significantly enriches code retrieval, while RepoHyper (Phan et al., 2024) shows that repository-level context outperforms snippet-level retrieval. The present system integrates these insights by constructing a dependency graph from chunk dictionaries, modelling inheritance hierarchies, import chains, and call relationships to provide structural reranking signals alongside lexical and semantic scores.

A Reciprocal Rank Fusion (RRF) reranker merges the three result sets — vector, lexical, and graph — into a single ranked list. In evaluation across Flask, Marshmallow, and Bandit repositories, this hybrid approach consistently outperformed either retriever in isolation on early precision (top-k results), confirming that the signals are genuinely complementary rather than redundant.

### Knowledge Graph and Lazy Reindexing

Beyond chunk-level retrieval, the system constructs a dependency graph that models how code components relate to one another. Nodes represent functions, classes, and modules; edges represent imports and function calls. This graph serves two roles: it enables graph-based structural reranking during retrieval, and it surfaces architectural context — inheritance hierarchies, cross-file reference patterns — that would otherwise be invisible to a flat vector search.

Maintaining this index efficiently over large, evolving codebases requires a lazy reindexing mechanism. The system tracks file modification timestamps against a SQLite metadata store; only files whose content has changed since last indexing are re-chunked and re-embedded. This significantly reduces the number of embedding API calls for large repositories, as unchanged files are skipped entirely. A version-lock mechanism prevents concurrency conflicts when multiple sessions trigger indexing simultaneously.

### Evaluation

I evaluated retrieval performance on five Python-dominant open-source repositories — Flask, Marshmallow, Jinja, Bandit, and Tornado — selected for their variety in size, architectural complexity, and Python composition above 90%. Subtle logic errors, control flow inversions, and API misuse bugs were introduced to simulate realistic debugging scenarios.

Retrieval quality was assessed using precision, recall, F1-score, and line overlap. Line overlap measures whether the retrieved chunks contain the *specific lines* where a bug is located, not merely the right file — a more demanding and practically meaningful metric. Results showed 80% precision and 65–80% line overlap on Flask pull requests, confirming that AST-based chunking genuinely localises relevant code. Recall remained the primary weakness at 13%, a predictable consequence of precision-first chunk sizing and conservative top-k parameters — both tunable and identified as the primary direction for improvement.

## The Debugger MCP: Bridging Static Retrieval and Runtime Reasoning

Where retrieval addresses static understanding, the Debugger MCP addresses dynamic understanding. Built on the Debug Adapter Protocol (DAP) — the same interface underpinning VS Code's debugging panel — the system exposes real-time program execution to language models through MCP. Conforming to an open standard ensures compatibility with any DAP-compatible runtime rather than coupling the system to a specific language or IDE.

Through the MCP interface, an AI agent can set and remove breakpoints programmatically, step through execution (into, over, out), inspect variable state and stack frames at any point, and receive compressed runtime summaries optimised for LLM consumption. The most technically demanding aspect was building an asynchronous event loop that prevents deadlocks when multiple breakpoint events fire concurrently. Rewriting the event-handling layer for non-blocking I/O resolved this, enabling stable multi-session debugging.

The result is an agent that can do what a human developer does: set a breakpoint, run the code, inspect what is actually in memory, and reason from evidence rather than inference. In a representative demonstration, given a bug report about an empty-list return value from a Flask view function, the system used RAG to locate the relevant route handler, set a breakpoint via DAP-MCP, stepped through execution, and identified that a query result was overwritten by an empty assignment two lines before the return.

This hand-off from retrieved context to live inspection is, I believe, the right architecture for the next generation of coding assistants: static retrieval narrows the search space; dynamic debugging confirms the hypothesis.

## Discussion

The results reveal a precision-first system well suited to triage, debugging, and code understanding. The unified chunk schema proved to be a foundational design decision — by ensuring that both AST and metadata strategies emit identical `Chunk` objects, downstream embedding, storage, retrieval, and evaluation components required no adaptation. Unified schemas eliminate integration friction and allow components to be developed and tested independently.

The hybrid retrieval architecture also proved pivotal. Contrary to the assumption that dense semantic retrieval would dominate, BM25 provided substantial complementary signal — particularly for queries involving specific function names or library calls where semantic generalisation was a liability. The RRF reranker's ability to fuse these signals without requiring per-query weight tuning is a practical advantage for deployment across diverse codebases.

## Limitations and Future Directions

The current AST implementation is Python-only. Extending to JavaScript and TypeScript via tree-sitter parsers is the most natural next step, unlocking semantic boundary precision for the languages most prevalent in production web applications. Multi-language AST coverage would also improve the Debugger MCP, as DAP language adapters could be added behind the same tool interface.

Recall can be improved by widening top-k parameters, enriching queries with dependency graph context before retrieval, and exploring cross-file query expansion for changes that span multiple modules. On the metadata enrichment side, incorporating branch and commit metadata would enable temporal search, allowing the system to reason about how code has changed over time — a capability relevant to debugging regressions.

The MCP server architecture would benefit from a unified base class standardising initialisation, configuration, and input/output validation across the RAG and Debugger servers. The current separation — the Debugger uses async lifespan configuration while the RAG server uses per-tool lazy initialisation — increases maintenance overhead and complicates future extension.

---

## References

Du, K., Rui, R., Chai, H., Fu, L., Xia, W., Wang, Y., Tang, R., Yu, Y., & Zhang, W. (2024). CodeGRAG: Extracting composed syntax graphs for retrieval augmented cross-lingual code generation. *arXiv preprint*. https://doi.org/10.48550/arxiv.2405.02355

Feng, Z., Guo, D., Tang, D., Duan, N., Feng, X., Gong, M., & Zhou, M. (2020). CodeBERT: A pre-trained model for programming and natural languages. *arXiv preprint arXiv:2002.08155*. https://doi.org/10.48550/arXiv.2002.08155

Guo, D., Ren, S., Lu, S., Feng, Z., Tang, D., Zhao, S., & Lin, S. (2021). GraphCodeBERT: Pre-training code representations with data flow. *arXiv preprint arXiv:2009.08366*. https://doi.org/10.48550/arXiv.2009.08366

Guo, D., Lu, S., Ren, S., Feng, Z., Tang, D., Wang, L., & Zhou, M. (2022). UniXcoder: Unified cross-modal pre-training for code representation. *arXiv preprint arXiv:2203.03850*. https://doi.org/10.48550/arXiv.2203.03850

Jain, P., Agarwal, S., Gupta, S., & Jain, A. (2022). A survey on information retrieval for software engineering. *Journal of Software Engineering Research and Development*, 10(1), 1–29. https://doi.org/10.1186/s40411-022-00117-8

Levin, K., van Kempen, Berger, E. D., & Freund, S. N. (2024). ChatDBG: An AI-powered debugging assistant. *arXiv preprint*. https://doi.org/10.48550/arxiv.2403.16354

Phan, H. N., Nguyen, T. N., & Bui, N. (2024). RepoHyper: Better context retrieval is all you need for repository-level code completion. *arXiv preprint*. https://doi.org/10.48550/arxiv.2403.06095

Sukharevsky, A., Kerr, D., Hjartar, K., Hämäläinen, L., Bout, S., & Leo, V. D. (2025, June 13). Seizing the agentic AI advantage. *McKinsey & Company*. https://www.mckinsey.com/capabilities/quantumblack/our-insights/seizing-the-agentic-ai-advantage

Wang, Y., Wang, W., Joty, S., & Lin, J. (2023). CodeT5+: Open code large language models for code understanding and generation. *arXiv preprint arXiv:2305.07922*. https://doi.org/10.48550/arXiv.2305.07922

Zhou, Z., Yu, H., Fan, G., Huang, Z., & Yang, X. (2021). Summarizing source code with hierarchical code representation. *Information and Software Technology*, 143, 106761. https://doi.org/10.1016/j.infsof.2021.106761
