
export const SingleRow = ({ title, onClick }: { title: string; onClick?: () => void; }) => {
  return (
    <div className="row-container" onClick={(e) => { onClick?.(); }}>
      <div className="row">
        <div className="title single">{title}</div>
      </div>
    </div>
  );
};

export default SingleRow;