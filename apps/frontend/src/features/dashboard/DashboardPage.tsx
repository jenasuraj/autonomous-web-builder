import { useEffect } from 'react';
import ChatInput from '../../components/dashboard/ChatInput';
import ChatMessages from '../../components/dashboard/ChatMessages';
import Sidebar from '../../components/dashboard/Sidebar';
import FormMessage from '../../components/ui/FormMessage';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  createThread,
  fetchThreads,
  openThread,
  sendMessage,
} from '../../store/dashboard/dashboardThunks';
import { APP_NAME } from '../../utils/helpers';


export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { threads, threadId, messages, loading, error } = useAppSelector((s) => s.dashboard);

  // On load: the sidebar list, and a fresh chat to type into
  useEffect(() => {
    void dispatch(fetchThreads());
    void dispatch(createThread());
  }, [dispatch]);

  return (
    <section className="flex h-screen gap-3 p-3 pt-16">
      <title>{`Dashboard — ${APP_NAME}`}</title>

      <Sidebar
        threads={threads}
        activeId={threadId}
        onNewChat={() => void dispatch(createThread())}
        onOpen={(id) => void dispatch(openThread(id))}
      />

      {/* chat, full height, input at the bottom */}
      <div className="flex min-h-0 w-[400px] shrink-0 flex-col rounded-xl border border-white/10">
        <ChatMessages messages={messages} loading={loading} />
        {error && (
          <div className="px-3">
            <FormMessage message={error} />
          </div>
        )}
        <ChatInput
          onSend={(message) => void dispatch(sendMessage(message))}
          disabled={loading || !threadId}
        />
      </div>

      {/* right: 80% top, 20% bottom */}
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <div className="flex-4 rounded-xl border border-white/10" />
        <div className="flex-1 rounded-xl border border-white/10" />
      </div>
    </section>
  );
}