import ExamCard from "./ExamCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { ClipboardCheck } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RecentExamsSection({ data }: any) {
  const recentExams = [...data]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardCheck size={22} />}
        title="No detailed analytics yet"
        description="Take more exams to unlock deeper performance insights."
        action={
          <Link href="/student/courses">
            <Button variant="primary">Start an Exam</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {recentExams.map((exam, i) => (
        <ExamCard key={i} exam={exam} />
      ))}
    </div>
  );
}
