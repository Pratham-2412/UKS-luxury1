import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import {
  getAdminCollections,
  getAdminProjects,
  getAdminProducts,
  getEnquiries,
  getOrders,
} from "../../api/adminApi";
import {
  RiFileListLine,
  RiProjectorLine,
  RiShoppingBagLine,
  RiMailLine,
  RiShoppingCartLine,
  RiArrowRightLine,
} from "react-icons/ri";
import { Link } from "react-router-dom";
import { S } from "../../components/admin/adminStyles";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const StatCard = ({ icon, label, value, link, color = "#c4a064" }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
    style={{ height: "100%" }}
  >
    <Link
      to={link}
      style={{
        ...S.card,
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        height: "100%",
        cursor: "pointer",
        transition: "border-color 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(196,160,100,0.3)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            background: `${color}14`,
            border: `1px solid ${color}35`,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            color,
          }}
        >
          {icon}
        </div>
        <RiArrowRightLine style={{ color: "#5a5550", fontSize: "1.2rem" }} />
      </div>

      <div>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "2.8rem",
            fontWeight: 400,
            color: "#ffffff",
            lineHeight: 1,
            marginBottom: "0.5rem",
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontSize: "0.85rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#a09880",
            fontWeight: 500,
          }}
        >
          {label}
        </p>
      </div>
    </Link>
  </motion.div>
);

const AdminDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    collections: 0,
    projects: 0,
    products: 0,
    inquiries: 0,
    orders: 0,
  });

  const [recentInquiries, setRecentInquiries] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    Promise.all([
      getAdminCollections(),
      getAdminProjects(),
      getAdminProducts(),
      getEnquiries({ limit: 5, sort: "-createdAt" }),
      getOrders({ limit: 5, sort: "-createdAt" }),
    ])
      .then(([col, proj, prod, enq, ord]) => {
        setStats({
          collections: col.data.total || col.data.data?.length || 0,
          projects: proj.data.total || proj.data.data?.length || 0,
          products: prod.data.total || prod.data.data?.length || 0,
          inquiries: enq.data.total || enq.data.data?.length || 0,
          orders: ord.data.total || ord.data.orders || ord.data.data?.length || 0,
        });

        setRecentInquiries(enq.data.data || enq.data.enquiries || []);
        setRecentOrders(ord.data.orders || ord.data.data || []);
      })
      .catch((error) => {
        console.error("Dashboard data load failed:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const STATS = [
    {
      icon: <RiFileListLine />,
      label: "Collections",
      value: stats.collections,
      link: "/admin/collections",
    },
    {
      icon: <RiProjectorLine />,
      label: "Projects",
      value: stats.projects,
      link: "/admin/projects",
    },
    {
      icon: <RiShoppingBagLine />,
      label: "Products",
      value: stats.products,
      link: "/admin/products",
    },
    {
      icon: <RiMailLine />,
      label: "Inquiries",
      value: stats.inquiries,
      link: "/admin/inquiries",
    },
    {
      icon: <RiShoppingCartLine />,
      label: "Orders",
      value: stats.orders,
      link: "/admin/orders",
      color: "#6da86d",
    },
  ];

  return (
    <AdminLayout title={`Welcome back, ${user?.name?.split(" ")[0] || "Admin"}`}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
          gap: isMobile ? "1rem" : "1.5rem",
          marginBottom: "3rem",
        }}
      >
        {STATS.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "2rem",
        }}
      >
        <div style={S.card}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}
          >
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.5rem", // Increased
                fontWeight: 400,
                color: "#ffffff", // White
              }}
            >
              Recent Inquiries
            </h3>

            <Link
              to="/admin/inquiries"
              style={{
                fontSize: "0.75rem", // Increased
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#c4a064",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              View All
            </Link>
          </div>

          {loading ? (
            <p style={{ color: "#5a5550", fontSize: "1rem" }}>Loading…</p>
          ) : recentInquiries.length === 0 ? (
            <p
              style={{
                color: "#5a5550",
                fontSize: "1rem",
                fontStyle: "italic",
              }}
            >
              No inquiries yet
            </p>
          ) : (
            recentInquiries.map((inq) => (
              <motion.div
                key={inq._id}
                whileHover={{ x: 5, background: "rgba(255,255,255,0.03)" }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.25rem 0.75rem",
                  margin: "0 -0.75rem",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "background 0.3s ease",
                }}
              >
                <div>
                  <p style={{ fontSize: "1.1rem", color: "#ffffff", fontWeight: 400, marginBottom: "0.25rem" }}>{inq.name}</p>
                  <p style={{ fontSize: "0.85rem", color: "#a09880" }}>{inq.inquiryType || "General"}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={S.badge(inq.status === "resolved" ? "green" : inq.status === "in-progress" ? "gold" : "gray")}>{inq.status || "new"}
                  </span>
                  <p style={{ fontSize: "0.75rem", color: "#5a5550", marginTop: "0.5rem" }}>{formatDate(inq.createdAt)}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div style={S.card}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
            }}
          >
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.5rem", // Increased
                fontWeight: 400,
                color: "#ffffff", // White
              }}
            >
              Recent Orders
            </h3>

            <Link
              to="/admin/orders"
              style={{
                fontSize: "0.75rem", // Increased
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#c4a064",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              View All
            </Link>
          </div>

          {loading ? (
            <p style={{ color: "#5a5550", fontSize: "1rem" }}>Loading…</p>
          ) : recentOrders.length === 0 ? (
            <p
              style={{
                color: "#5a5550",
                fontSize: "1rem",
                fontStyle: "italic",
              }}
            >
              No orders yet
            </p>
          ) : (
            recentOrders.map((order) => (
              <motion.div
                key={order._id}
                whileHover={{ x: 5, background: "rgba(255,255,255,0.03)" }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.25rem 0.75rem",
                  margin: "0 -0.75rem",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "background 0.3s ease",
                }}
              >
                <div>
                  <p style={{ fontSize: "1.1rem", color: "#ffffff", fontWeight: 400, marginBottom: "0.25rem" }}>{order.customerEmail || "Guest"}</p>
                  <p style={{ fontSize: "0.85rem", color: "#a09880" }}>{order.items?.length || 0} items</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "#c4a064", marginBottom: "0.4rem" }}>{formatCurrency(order.totalAmount || 0)}</p>
                  <span style={S.badge(order.paymentStatus === "paid" ? "green" : "gold")}>{order.paymentStatus || "pending"}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;