import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { queryClient } from "./main";

function App() {
  const { isPending, data, isError, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            How The Day Will Be ! 🚀
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <TaskTableSkeleton />
          ) : isError ? (
            <div className="text-center py-4 text-red-500">
              <AlertCircle className="mx-auto h-10 w-10 mb-2" />
              <p>Error: {error.message}</p>
            </div>
          ) : (
            <Table>
              <TableCaption>A list of your recent tasks.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%]">Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right cursor-pointer">
                      <Badge
                        variant={task.completed ? "secondary" : "default"}
                        onClick={() => checkTask(task.id)}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : null}
                        {task.completed ? "Completed" : "Todo"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TaskTableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex justify-between items-center">
          <Skeleton className="h-4 w-[60%]" />
          <Skeleton className="h-4 w-[20%]" />
        </div>
      ))}
    </div>
  );
}

async function getTasks() {
  const response = await fetch("/api/tasks");
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  const tasks = await response.json();
  return tasks;
}

async function checkTask(id: string) {
  const response = await fetch(`/api/tasks/${id}/check`, {
    method: "PUT",
  });
  if (!response.ok) {
    throw new Error("Failed to check task");
  }

  // Refetch the tasks after checking the task
  queryClient.invalidateQueries({ queryKey: ["tasks"] });
}

export default App;
