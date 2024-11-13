import "../App.css"

const AdminDashboard: React.FC = () =>  {
    return ( 
        <div className="dashboard-container">
            <div className="search-bar">
                <input type="text" placeholder="Search..." />
            </div>
            <div className="dashboard-sections">
                <section className="section add-product">
                    <h2>Add Product</h2>
                </section>
                <section className="section add-trending-product">
                    <h2>Add Trending Product</h2>
                </section>
                <section className="section customer-list">
                    <h2>Customer List</h2>
                </section>
            </div>
        </div>
     );
}

export default AdminDashboard;