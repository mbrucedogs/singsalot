interface SingleRowProps { 
  title: string; 
  onClick?: () => void; 
}

export const SingleRow = ({ title, onClick }: SingleRowProps) => {
  return (
    <div className="row-container" onClick={(e) => { onClick?.(); }}>
      <div className="row">
        <div className="title single">{title}</div>
      </div>
    </div>
  );
};

export default SingleRow;