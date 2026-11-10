import { ArrowLeft, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main className="not-found">
      <SearchX size={52} aria-hidden="true" />
      <h1>Page not found</h1>
      <p>The address you tried doesn't exist or was moved.</p>
      <Link className="button button-primary" to="/">
        <ArrowLeft size={17} aria-hidden="true" /> Back to overview
      </Link>
    </main>
  );
}

export default NotFound;
