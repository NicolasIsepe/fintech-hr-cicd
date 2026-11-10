interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: PaginationProps) {
  return (
    <nav className="pagination" aria-label="Employee pagination">
      <span>
        Page {currentPage} of {totalPages}
      </span>

      <div className="pagination-actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={onPrevious}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <button
          type="button"
          className="button button-secondary"
          onClick={onNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
