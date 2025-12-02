import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
  mobile: string;
  service: string;
  description: string;
}
const API = import.meta.env.VITE_SERVER_URL;

export default function Form() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    service: "",
    description: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);

  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
    description: "",
  });

  const handleChange = (key: keyof FormData, value: string) => {
    setForm({ ...form, [key]: value });

    if (key === "email") {
      const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors((p) => ({
        ...p,
        email: reg.test(value) ? "" : "Enter a valid email",
      }));
    }

    if (key === "mobile") {
      const reg = /^[0-9]{10}$/;
      setErrors((p) => ({
        ...p,
        mobile: reg.test(value) ? "" : "Mobile number must be 10 digits",
      }));
    }

    if (key === "description") {
      const count = value.trim().split(/\s+/).length;
      setErrors((p) => ({
        ...p,
        description: count >= 10 ? "" : "Description must be at least 10 words",
      }));
    }
  };

  const sendOtp = async () => {
    if (errors.email || !form.email) {
      alert("Enter a valid email to send OTP");
      return;
    }

    try {
      setTimer(60);
      setOtpSent(true);
      await axios.post(`${API}/api/send-otp`, {
        email: form.email,
      });
      alert("OTP sent to email!");
    } catch {
      alert("Failed to send OTP. Try again.");
    }
  };

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const verifyOtp = async () => {
    try {
      const res = await axios.post(`${API}/api/verify-otp`, {
        email: form.email,
        otp,
      });

      if (res.data.success) {
        setOtpVerified(true);
        alert("OTP verified!");
      } else alert("Wrong OTP!");
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (errors.email || errors.mobile || errors.description) {
      alert("Please fix the errors before submitting.");
      return;
    }

    if (!otpVerified) {
      alert("Verify OTP first!");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/submit`, form);

      if (res.data.success) {
        navigate(`/thankyou?id=${res.data.id}`);
      }
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-gray-100 px-4 py-10">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl shadow-xl border border-gray-200 rounded-2xl p-6 sm:p-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800">
          Service Request Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Email
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={sendOtp}
                disabled={timer > 0 || !!errors.email || !form.email}
                className={`px-4 py-2 rounded-xl text-white w-full sm:w-auto ${
                  timer > 0 || !!errors.email || !form.email
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Send OTP"}
              </button>
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {otpSent && (
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Enter OTP
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={verifyOtp}
                  className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                >
                  Verify
                </button>
              </div>

              {otpVerified && (
                <p className="text-green-600 text-sm font-semibold mt-1">
                  OTP Verified
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Mobile Number
            </label>
            <input
              type="text"
              value={form.mobile}
              onChange={(e) => handleChange("mobile", e.target.value)}
              className="w-full px-4 py-2 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Service
            </label>
            <select
              value={form.service}
              onChange={(e) => handleChange("service", e.target.value)}
              className="w-full px-4 py-2 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Service</option>
              <option value="web">Website Development</option>
              <option value="landing">Landing Page</option>
              <option value="seo">SEO Optimization</option>
              <option value="branding">Branding</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Project Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!otpVerified}
            className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all ${
              otpVerified
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
