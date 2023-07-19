// claude.d.ts

declare module "claude-ai-test" {

  export class Claude {
    constructor(options: {
      sessionKey: string;
      proxy?: string | ProxyFunction;
      fetch?: typeof fetch; 
    });

    init(): Promise<void>;

    models(): string[];

    totalTokens(model?: string): number;

    defaultModel(): string;

    sendMessage(message: string, params?: SendMessageParams): Promise<MessageResponse>;
    
    // ...other methods    
  }

  export class Conversation {
    constructor(claude: Claude, options: ConversationOptions);

    sendMessage(message: string, params?: SendMessageParams): Promise<MessageResponse>;
    
    // ...other methods
  }

  export class Message {
    constructor(params: MessageParams);

    sendFeedback(type: FeedbackType, reason?: string): Promise<FeedbackResponse>;

    // ...other properties
  }

  interface ProxyFunction {
    (options: { endpoint: string, options: RequestInit }): { endpoint: string, options: RequestInit }; 
  }

  interface SendMessageParams {
    conversation?: string;
    temporary?: boolean;
    // ...other options
  }

  interface MessageResponse {
    completion: string;
    stop_reason: string | null;
    // ...other properties
  }

  interface FeedbackResponse {
    uuid: string;
    type: FeedbackType;
    reason: string | null;
    // ...other properties
  }

  type FeedbackType = "flag/bug" | "flag/harmful" | "flag/other";

  // Other interfaces...
}