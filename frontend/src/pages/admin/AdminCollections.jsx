import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import CollectionsList from "./collections/CollectionsList";
import BrandsList from "./collections/BrandsList";
import ItemsList from "./collections/ItemsList";

const AdminCollections = () => {
  const [view, setView] = useState("collections"); // "collections" | "brands" | "items"
  const [activeCollection, setActiveCollection] = useState(null);
  const [activeBrand, setActiveBrand] = useState(null);

  const handleManageBrands = (collection) => {
    setActiveCollection(collection);
    setView("brands");
  };

  const handleManageItems = (brand) => {
    setActiveBrand(brand);
    setView("items");
  };

  return (
    <AdminLayout title={
      view === "collections" ? "Collections Hierarchy" : 
      view === "brands" ? `Brands in ${activeCollection?.title}` : 
      `Items in ${activeBrand?.name}`
    }>
      {view === "collections" && (
        <CollectionsList onManageBrands={handleManageBrands} />
      )}
      
      {view === "brands" && activeCollection && (
        <BrandsList 
          collection={activeCollection} 
          onBack={() => setView("collections")} 
          onManageItems={handleManageItems} 
        />
      )}
      
      {view === "items" && activeBrand && (
        <ItemsList 
          brand={activeBrand} 
          onBack={() => setView("brands")} 
        />
      )}
    </AdminLayout>
  );
};

export default AdminCollections;