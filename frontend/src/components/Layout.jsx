import { Header } from './Header';
import { Sidebar } from './Sidebar';
import '../styles/Layout.css';

export function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
