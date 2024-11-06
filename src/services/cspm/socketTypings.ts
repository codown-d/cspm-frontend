declare namespace API {
  export interface AiHistoryResponse {
    data: {
      conversation_id: string;
      created_at: number;
      title: string;
      updated_at: number;
    }[];
    index: number;
    per_page: number;
    total: number;
  }

  export interface AiHistoryByIdResponse {
    conversation_id: string;
    created_at: number;
    title: string;
    updated_at: number;
    items: [string, string][];
  }
  export interface AiConversationReq {
    type?: string;
    action?: string;
    user_questions?: string;
    actual_questions?: string; //'添加prompt后的问题',
    conversation_id?: string | number; //#继续一个历史对话的上下文，若是新对话则为0
    confirm?: string;
  }
}
