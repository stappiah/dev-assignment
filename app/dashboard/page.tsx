"use client";

import { Button } from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import { Input } from "@/components/InputComponent";
import { Select, SelectItem } from "@/components/SelectComponent";
import { useState } from "react";
import { useGetProjectsQuery } from "../api/ApiSlice";
import { Project } from "../Types";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth, selectUsername } from "../api/AuthSlice";
import { CircularProgress } from "@mui/material";
import { persistor } from "../Store";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data, error, isLoading } = useGetProjectsQuery();
  const username = useSelector(selectUsername);
  const dispatch = useDispatch();
  const router = useRouter();
  const projects: Project[] = data?.data || [];
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleLogout = () => {
    dispatch(clearAuth());
    persistor?.purge();
    router.push("/");
  };

  const filteredProjects = projects?.filter(
    (project) =>
      project.name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "" || project.status === statusFilter)
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress size={50} sx={{ color: "#2B7FFF" }} />
      </div>
    );
  if (error) return <div>Error loading projects</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header with Avatar and Logout */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaUserCircle className="text-3xl text-gray-600" />
            <span className="text-lg font-medium">{username}</span>
          </div>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent>Total: {data?.count}</CardContent>
        </Card>
        <Card>
          <CardContent>
            Completed:{" "}
            {projects?.filter((p) => p.status === "Completed").length}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            Pending: {projects?.filter((p) => p.status === "Pending").length}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            Ongoing: {projects?.filter((p) => p.status === "Ongoing").length}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            Delayed: {projects?.filter((p) => p.status === "Delayed").length}
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <SelectItem value="">All</SelectItem>
          <SelectItem value="Not Started">Not Started</SelectItem>
          <SelectItem value="Ongoing">Ongoing</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Delayed">Delayed</SelectItem>
        </Select>
      </div>

      {/* Projects Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-lg bg-white rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Partner</th>
              <th className="p-3">Status</th>
              <th className="p-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, index) => (
              <tr
                key={project.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200 transition duration-200`}
              >
                <td className="border border-[#ddd] p-2">{project.name}</td>
                <td className="border border-[#ddd] p-2">{project.partner}</td>
                <td className="border border-[#ddd] p-2">{project.status}</td>
                <td className="border border-[#ddd] p-2">
                  {project.amount_currency} {project.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
