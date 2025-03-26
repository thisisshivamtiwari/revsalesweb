import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail } from "lucide-react"
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLoginMutation } from "@/lib/features/auth/authApi"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ email: "", password: "" })
  const [login, { isLoading }] = useLoginMutation()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = { email: "", password: "" }
    let isValid = true

    if (!email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = "Please enter a valid email"
      isValid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (password.length < 5) {
      newErrors.password = "Password must be at least 5 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const response = await login({ email, password }).unwrap()
      if (response.status) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify({
          fullName: response.data.fullName,
          profileImg: response.data.profileImg,
          companyId: response.data.companyId
        }))
        toast.success("Login successful!")
        navigate("/dashboard")
      }
    } catch (error: any) {
      if (error?.data?.message) {
        toast.error(error.data.message)
      } else if (error?.status === 401) {
        toast.error("Invalid email or password")
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#0A0F20] via-[#242744] to-[#2F304D]">
      <Toaster position="top-right" />
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-[#242744]/30 backdrop-blur-lg rounded-3xl border border-[#2F304D]/20 shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">
                Welcome Back in RevSales
              </h1>
              <p className="text-gray-400">Level up your sales game</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300" htmlFor="email">
                  Work Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: "" })
                    }}
                    className={`bg-[#1A1F35] border-[#2F304D]/50 text-white pl-10 placeholder-gray-400 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="work@email.com"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors({ ...errors, password: "" })
                    }}
                    className={`bg-[#1A1F35] border-[#2F304D]/50 text-white pr-10 placeholder-gray-400 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#FF5A81] hover:bg-[#FF5A81]/90 text-white font-medium py-2 rounded-lg flex items-center justify-center space-x-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Login with Email"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                No account yet?{" "}
                <Button
                  variant="link"
                  className="text-[#FF5A81] hover:text-[#FF5A81]/90 p-0"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </Button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 
 
 