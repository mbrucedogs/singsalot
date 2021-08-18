interface SingleRowProps { 
  title: string; 
  onClick?: () => void; 
}

export const SingleRow: React.FC<SingleRowProps> = ({ title, onClick }) => {
  return (
    <div className="row-container" onClick={(e) => { onClick?.(); }}>
      <div className="row">
        <div className="title single">{title}</div>
      </div>
    </div>
  );
};

export default SingleRow;