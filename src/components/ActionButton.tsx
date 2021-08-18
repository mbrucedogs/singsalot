import { IonButton, IonIcon } from "@ionic/react"

interface ActionButtonProps{
    hidden?: boolean,
    imageOutline: string,
    image: string,
    onClick: () => void
}

export const ActionButton: React.FC<ActionButtonProps> = ({hidden = false, imageOutline, image, onClick}) => {
    return (
        <IonButton hidden={hidden} onClick={onClick ? (e) => { onClick?.() } : () => { }}>
            <IonIcon size="large" ios={imageOutline} md={image}/>
        </IonButton>
    )
}
