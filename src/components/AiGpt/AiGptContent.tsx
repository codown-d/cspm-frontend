import { useModel } from '@umijs/max';
import { memo } from 'react';
import Conversation from './Conversation';
import List from './List';

export type AiGptContentProps = {
  onClose: VoidFunction;
};
function AiGptContent(props: AiGptContentProps) {
  const { onClose } = props;
  const { type, newConversation, conversationParam } = useModel('aiGptModel');

  return (
    <div className="ai-gpt-content">
      {type === 'list' && (
        <List
          onClose={onClose}
          toConversation={(id) => {
            newConversation({ conversation_id: id });
          }}
        />
      )}
      {type === 'conversation' && (
        <Conversation
          key={
            conversationParam?.conversation_id ||
            conversationParam?.prompt_by_id ||
            0
          }
          onClose={onClose}
        />
      )}
    </div>
  );
}

export default memo(AiGptContent);
