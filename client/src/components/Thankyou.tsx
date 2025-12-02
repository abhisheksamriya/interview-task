import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
}
const API = import.meta.env.VITE_SERVER_URL;

export default function ThankYou() {
  const [data, setData] = useState<FormData | null>(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    axios.get(`${API}/lead/${id}`).then((res) => setData(res.data));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-liner-to-br from-green-50 to-gray-100 px-4 py-10">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl shadow-xl border border-gray-200 rounded-2xl p-6 sm:p-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-green-700">
          Thank You !
        </h2>

        {data ? (
          <p className="text-center text-base sm:text-lg text-gray-700 leading-relaxed">
            Thank you{" "}
            <span className="font-semibold text-green-600">{data.name}</span>
            <br />
            for submitting the form.
            <br />
            your email:
            <span className="font-semibold text-blue-600"> {data.email}</span>
          </p>
        ) : (
          <p className="text-center text-gray-600">Loading...</p>
        )}

        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition w-full sm:w-auto"
          >
            Go Back Home
          </a>
        </div>
      </div>
    </div>
  );
}
