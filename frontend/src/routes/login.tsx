import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import api from '../lib/api'
import { Utensils, Phone, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const [mobileNumber, setMobileNumber] = useState('')
  const [pin, setPin] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login'
      const response = await api.post(endpoint, { mobile_number: mobileNumber, pin })
      localStorage.setItem('token', response.data.access_token)
      navigate({ to: '/dashboard' })
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mesh flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-primary p-3 rounded-2xl shadow-lg mb-4">
             <Utensils className="text-white h-8 w-8" />
          </div>
          <h2 className="font-heading text-3xl font-bold tracking-tighter">YUMYUM VENDOR</h2>
          <p className="text-gray-500 mt-2">Manage your digital storefront</p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-orange-50">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h3 className="text-xl font-bold text-center mb-2">
               {isRegistering ? "Create Account" : "Welcome Back"}
            </h3>
            
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="mobile" className="text-sm font-semibold text-gray-700 ml-1">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="mobile"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full pl-12 pr-4 h-14 rounded-xl border-2 border-gray-100 focus:border-primary focus:outline-none transition-all text-lg font-mono tracking-wider"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="pin" className="text-sm font-semibold text-gray-700 ml-1">Secret PIN (4 digits)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pl-12 pr-4 h-14 rounded-xl border-2 border-gray-100 focus:border-primary focus:outline-none transition-all text-2xl font-mono tracking-[0.5em] text-center"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary hover:bg-orange-600 text-white h-14 rounded-xl text-lg font-bold shadow-lg shadow-orange-200 transition-all active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>{isRegistering ? "Register" : "Login"} <ArrowRight className="ml-2 h-5 w-5" /></>
              )}
            </Button>

            <button 
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering)
                setError('')
                setPin('')
              }}
              className="text-sm font-bold text-gray-500 hover:text-primary transition-colors"
            >
              {isRegistering ? "Already have an account? Login" : "New here? Create an account"}
            </button>
          </form>
        </div>

        {/* Back to Home */}
        <div className="mt-10 text-center">
           <Link to="/" className="text-gray-500 hover:text-primary transition-colors font-medium inline-flex items-center gap-1">
              ← Back to discovery
           </Link>
        </div>
      </div>
    </div>
  )
}
