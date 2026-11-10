import { Plus } from 'lucide-react';
import { APP_NAME } from '../../utils/helpers';
import SectionHeading from './SectionHeading';

const faqs = [
  {
    question: `What can I build with ${APP_NAME}?`,
    answer:
      'Websites, dashboards, landing pages, internal tools and full-stack apps using JavaScript frameworks like React, Vue, Svelte, Angular and Node.js.',
  },
  {
    question: 'Do I need to know how to code?',
    answer:
      'No. You can build entirely by chatting. If you do code, you can open and edit every file the agent creates.',
  },
  {
    question: 'Where does my app run?',
    answer:
      'Inside your browser, in a sandboxed Node.js environment. Nothing needs to be installed on your machine.',
  },
  {
    question: 'Can I use a Python or Go backend?',
    answer:
      'The live preview runs JavaScript and Node.js only. For other backends, the agent builds an equivalent Node.js server instead.',
  },
  {
    question: 'Can I take my code with me?',
    answer:
      'Yes. Download the full project at any time and run it locally or deploy it anywhere you like.',
  },
];

export default function Faq() {
  return (
    <section id="faq" className="px-4 py-24">
      <SectionHeading eyebrow="FAQ" title="Questions, answered" />
      <div className="mx-auto mt-12 max-w-3xl divide-y divide-white/10 border-y border-white/10">
        {faqs.map(({ question, answer }) => (
          <details key={question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
              {question}
              <Plus className="size-5 shrink-0 text-zinc-500 transition group-open:rotate-45" />
            </summary>
            <p className="mt-3 pr-9 text-sm leading-relaxed text-zinc-400">
              {answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
