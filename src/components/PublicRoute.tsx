import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface PublicRouteProps {
  children: ReactNode
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const token = localStorage.getItem('token')

  if (token) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default PublicRoute
