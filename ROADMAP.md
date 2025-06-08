## 🪱 Sandworm AI Agent – Dev Roadmap

**Agent Codename:** `Worm Ai`
**Purpose:** Make deep onchain data analysis radically more accessible for non-devs, analysts, and social communities via natural language querying.

---

### 🔮 Core Objective

Turn human language into raw onchain insight.
Worm AI serves as a natural language interface for WQL (Worm Query Language). It parses user prompts, generates valid queries, executes them, and returns digestible outputs — either as query code (in IDE/web) or simplified results (on social clients like Discord).

---

### 🌐 Dual Environment Strategy

| Environment                        | Role                        | Behavior                                                                                                                                                                         |
| ---------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Web IDE**                        | Analyst/developer interface | Acts as a power tool: generates WQL from NL prompts, fixes broken queries, explains outputs, and guides user navigation.                                                         |
| **Social Clients (e.g., Discord)** | End-user interface          | Acts as an autonomous assistant: handles natural language prompts, generates + executes queries, returns lightweight results (text, small tables, or charts). Code is not shown. |

Both environments share the same:

- Plugin system (for protocol registration, charting, formatting, etc.)
- Core inference model
- Rate limits and validation logic

---

### 🧠 Core Features (IDE & Web)

- **Natural Language → WQL:** Convert vague or complex prompts into valid Sandworm queries.
- **Query Repair:** Automatically fix common issues like:

  - Syntax errors
  - Misspelled table/column names
  - Unsupported functions or malformed expressions

- **Conversational Guidance:** If context is unclear (e.g., missing chain, token, time range), Eliza will prompt users to clarify.
- **IDE Companion:** Serves as a proactive guide — suggests actions, explains errors, or explores data inline while users type.

---

### 💬 Social Mode (Discord AI Agent)

- Users type prompts like:

  > "Spot today’s most traded pool on Base Uniswap"

- **Agent Behavior:**

  - Parses and validates prompt.
  - Clarifies ambiguities via follow-up questions.
  - Generates WQL, runs it, formats result.
  - Returns result _only_ (not query code):

    - Text summary (e.g., pool name, volume)
    - Table (small result set only)
    - Chart (top tokens, usage trends, etc.)

  - Response formatting adapts to content type and channel.

---

### 🛡️ Validation & Safety

- **Row limits:** Enforced on social clients to prevent flooding or overload.
- **Rate limiting:** If query generation fails 3× consecutively:

  - Eliza stops retrying
  - Suggests user visit the web app
  - Logs the error case for system improvements

- **Environment-aware fallbacks:** Social agent offloads complex queries to the web app when needed.

---

### ⚙️ Plugin System for Protocols

- Protocols can initialize the Sandworm agent on their Discord.
- Each protocol instance inherits:

  - Shared plugins (query definitions, chart presets, token mapping)
  - Custom onboarding prompt for that protocol
  - Access to Sandworm’s shared validation + formatting logic

---

### 📍Future Features (Post-MVP)

- Personalized memory per Discord user (e.g. preferred tokens/chains)
- Query history on Discord (limited)
- Alert subscriptions ("Tell me when Pepe flips DOGE in TVL")
- AI-assisted dashboards from conversations ("Create a daily DEX leaderboard for me")

---

### 🚧 Current Dev Status

- [ ] Natural language → WQL model v1
- [ ] Clarification dialogue framework
- [ ] IDE inline assistant mode
- [ ] Discord bot prototype
- [ ] Plugin-based result formatter (text/table/chart)
- [ ] Protocol onboarding flow
- [ ] Query error logging + retry policy
- [ ] Rate limit + safety guardrails

---

### 🐛 Example Prompt → Flow

> **User:** "Show me top 5 pools for trading meme tokens on Base today"

1. **Clarify context:**

   - What defines “meme tokens”? (use tag or known list)
   - What’s the timeframe? (defaults to current day)

2. **WQL Generated:**

   ```sql
   SELECT pool_id, volume_usd
   FROM base.uniswap_Pool
     AND token0 IN [list_of_meme_tokens] OR token1 IN [list_of_meme_tokens]
     AND created_at_timestamp > today()
   ORDER BY volume_usd DESC
   LIMIT 5
   ```

3. **Return (on Discord):**

   ```
   Top 5 Meme Pools on Base Today 🧪
   1. $PEPE-$WETH — $3.2M
   2. $DOGE-$USDC — $2.7M
   ...
   ```
