import { NavLink } from "react-router-dom"
import "./Navbar.css"

const links = [
  { to: "/",              label: "🏠 Dashboard"        },
  { to: "/habitaciones",  label: "🛏️ Habitaciones"     },
  { to: "/clientes",      label: "👤 Clientes"          },
  { to: "/servicios",     label: "🛎️ Servicios"         },
  { to: "/reservaciones", label: "📅 Reservaciones"     },
  { to: "/checkout",      label: "💳 Check-Out"         },
]

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">🏨 Hotel Manager</div>
      <div className="navbar-links">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}