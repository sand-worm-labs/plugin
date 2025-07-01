export const chainSupportExamples = [
    [
      {
        name: '{{name1}}',
        content: {
          text: "What chains does Sandworm support?"
        }
      },
      {
        name: '{{name2}}',
        content: {
          text: "Sandworm currently supports Ethereum, Base, Sui, and Arbitrum.",
          thought: "The user is asking for a list of sandworm supported chains, triggering the GET_CHAIN_SUPPORT action.",
          actions: ["GET_CHAIN_SUPPORT"]
        }
      }
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: "Can I query on Sui using Sandworm?"
        }
      },
      {
        name: '{{name2}}',
        content: {
          text: "Yes! Sui is one of the supported chains.",
          thought: "User asked if a specific chain (Sui) is supported. This falls under the GET_CHAIN_SUPPORT action.",
          actions: ["GET_CHAIN_SUPPORT"]
        }
      }
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: "Is Solana supported?"
        }
      },
      {
        name: '{{name2}}',
        content: {
          text: "Not yet — current supported chains are Ethereum, Base, Sui, and Arbitrum.",
          thought: "The user inquired about Solana, which is not supported yet. Returning the current chain support list.",
          actions: ["GET_CHAIN_SUPPORT"]
        }
      }
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: "Does Sandworm support Base?"
        }
      },
      {
        name: '{{name2}}',
        content: {
          text: "Yes, Base is supported in Sandworm.",
          thought: "User directly asked about Base, which is a supported chain. Responding affirmatively.",
          actions: ["GET_CHAIN_SUPPORT"]
        }
      }
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: "Which chains can I use Sandworm on?"
        }
      },
      {
        name: '{{name2}}',
        content: {
          text: "You can currently use Sandworm on Ethereum, Base, Sui, and Arbitrum.",
          thought: "This is a general inquiry into supported networks, triggering GET_CHAIN_SUPPORT.",
          actions: ["GET_CHAIN_SUPPORT"]
        }
      }
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: "Can I use Sandworm with EVM chains?"
        }
      },
      {
        name: '{{name2}}',
        content: {
          text: "Yes, Sandworm supports multiple EVM chains including Ethereum and Base.",
          thought: "User asked about EVM compatibility, and the supported chains fall under that.",
          actions: ["GET_CHAIN_SUPPORT"]
        }
      }
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: "Are there any supported chains?"
        }
      },
      {
        name: '{{name2}}',
        content: {
          text: "Yep! Sandworm supports Ethereum, Base, Sui, and Arbitrum.",
          thought: "Broad inquiry about chain support — responded with the full current list.",
          actions: ["GET_CHAIN_SUPPORT"]
        }
      }
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: "Is Arbitrum in the list of supported chains?"
        }
      },
      {
        name: '{{name2}}',
        content: {
          text: "Yes, Arbitrum is fully supported by Sandworm.",
          thought: "User is asking about Arbitrum specifically. It’s supported, so reply affirmatively.",
          actions: ["GET_CHAIN_SUPPORT"]
        }
      }
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: "Can I use Sandworm to explore Sui?"
        }
      },
      {
        name: '{{name2}}',
        content: {
          text: "Absolutely. Sui is one of the core supported chains in Sandworm.",
          thought: "User wants to know if Sandworm supports Sui. It does. Return confidently.",
          actions: ["GET_CHAIN_SUPPORT"]
        }
      }
    ]
  ]
  