import { CircularProgress } from "@mui/material";

export default function LoginSignupLoader() {
  return (
    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            <CircularProgress size={20} sx={{ color: "white" }} />
    </button>
  );
}
