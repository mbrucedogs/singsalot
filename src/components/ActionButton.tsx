import { IonButton, IonIcon } from "@ionic/react"

export const ActionButton = ({
    hidden = false,
    imageOutline,
    image,
    onClick
}: {
    hidden?: boolean,
    imageOutline: string,
    image: string,
    onClick: () => void
}) => {
    return (
        <IonButton hidden={hidden} onClick={onClick ? (e) => { onClick?.() } : () => { }}>
            <IonIcon size="large" ios={imageOutline} md={image}/>
        </IonButton>
    )
}
