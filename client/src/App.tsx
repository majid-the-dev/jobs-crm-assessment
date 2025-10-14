import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Toaster } from "@/components/ui/sonner";
import KanbanBoard from "@/components/KanbanBoard";
import JobDetail from "@/components/JobDetail";
import CreateJob from "@/components/CreateJob";
import CustomerDetail from "@/components/CustomerDetail";
import Customers from "@/components/Customers";
import Technicians from "@/components/Technicians";
import TechnicianDetail from "@/components/TechnicianDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <Toaster position="top-right" richColors />
        <BrowserRouter>
          <div className="min-h-screen bg-muted/40">
            <div className="w-full bg-blue-500">
              <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                <h1 className="text-lg font-bold text-white">
                  <Link
                    to="/"
                    className="hover:text-blue-100 transition-colors"
                  >
                    JOBS CRM
                  </Link>
                </h1>
                <nav className="flex items-center gap-8">
                  <Link
                    to="/"
                    className="text-white text-sm hover:text-blue-100 transition-colors"
                  >
                    Jobs Board
                  </Link>
                  <Link
                    to="/customers"
                    className="text-white text-sm hover:text-blue-100 transition-colors"
                  >
                    Customers
                  </Link>
                  <Link
                    to="/technicians"
                    className="text-white text-sm hover:text-blue-100 transition-colors"
                  >
                    Technicians
                  </Link>
                  <Link
                    to="/jobs/new"
                    className="bg-white text-blue-600 text-sm hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Create Job
                  </Link>
                </nav>
              </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<KanbanBoard />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/jobs/new" element={<CreateJob />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/customers/:id" element={<CustomerDetail />} />
                <Route path="/technicians" element={<Technicians />} />
                <Route path="/technicians/:id" element={<TechnicianDetail />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </DndProvider>
    </QueryClientProvider>
  );
}

export default App;