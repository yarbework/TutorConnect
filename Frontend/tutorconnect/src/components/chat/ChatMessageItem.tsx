'use client';

import { EngagementMessage } from '../../types/engagement';

interface Props {
  message: EngagementMessage;
  isSelf: boolean;
}

export default function ChatMessageItem({ message, isSelf }: Props) {
  const isSystem = message.content.startsWith('Engagement initialized!');

  if (isSystem) {
    return (
      <div className="my-4 flex justify-center">
        <div className="max-w-md bg-amber-50 border border-amber-200/80 text-amber-900 text-xs px-4 py-2.5 rounded-2xl text-center leading-relaxed shadow-xs">
          <span className="font-bold block mb-0.5">System Notice</span>
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} my-2`}>
      <div
        className={`max-w-[75%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
          isSelf
            ? 'bg-blue-700 text-white rounded-br-xs shadow-sm'
            : 'bg-slate-100 text-slate-900 rounded-bl-xs'
        }`}
      >
        <p className="whitespace-pre-line">{message.content}</p>
      </div>
      <span className="text-[10px] text-slate-400 px-1 mt-1">
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}