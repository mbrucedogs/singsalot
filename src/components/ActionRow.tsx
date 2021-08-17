import { IonButtons } from '@ionic/react';

export const ActionRow = (
    {
        columns,
        actionButtons,
        gridTemplateColumns,
        rowStyle = "row" }
        : {
            columns: JSX.Element[];
            gridTemplateColumns: string;
            actionButtons: JSX.Element[];
            rowStyle?: string;
        }) => {
    return (
        <div className="row-container">
            <div className={rowStyle} style={{ display: 'grid', gridTemplateColumns: gridTemplateColumns }}>
                {columns.map((c, index) => <div key={index}>{c}</div>)}
                <IonButtons slot="end">
                    {actionButtons.map((c, index) => <div key={index}>{c}</div>)}
                </IonButtons>
            </div>
        </div>
    );
};

export default ActionRow;