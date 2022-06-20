


const settings = () => {
	return (
		<IonPage>
			<IonLoading
	        	cssClass='loadingPage'
    	    	isOpen={modalState.loadingPage === "lookingForSyntaxDocs"}
    		    onDidDismiss={() => dispatch(setLoadingPage(false))}
	        	message={'Please wait...'}
				spinner="bubbles"
				/*duration={300000}*/
				duration={1000}
			/>
			<LoadMS />
			<ExportMS />
			<DeleteMS />
			<SyntaxHeader title="MorphoSyntax Settings" />
			<IonContent fullscreen className="evenBackground disappearingHeaderKludgeFix" id="morphoSyntaxPage">
				<IonList lines="none">
					<IonItem>
						<IonLabel position="stacked" style={ {fontSize: "20px"} }>MorphoSyntax Title:</IonLabel>
						<IonInput value={msInfo.title} id="msTitle" className="ion-margin-top" placeholder="Usually the language name." onIonChange={() => setNewInfo("msTitle", "title")}></IonInput>
					</IonItem>
					<IonItem>
						<IonLabel position="stacked" style={ {fontSize: "20px"} }>Description:</IonLabel>
						<IonTextarea value={msInfo.description} id="msDesc" className="ion-margin-top" placeholder="A short description of this document." rows={3} onIonChange={() => setNewInfo("msDesc", "description")} />
					</IonItem>
				</IonList>
				<IonList lines="none" className="ion-float-end aside">
					<IonItem button={true} onClick={() => clearMS()}>
						<IonIcon icon={removeCircleOutline} className="ion-padding-end" />
						<IonLabel>Clear MorphoSyntax Info</IonLabel>
					</IonItem>
					<IonItem button={true} onClick={() => openMSModal("LoadMS")}>
						<IonIcon icon={addCircleOutline} className="ion-padding-end" />
						<IonLabel>Load MorphoSyntax Info</IonLabel>
					</IonItem>
					<IonItem button={true} onClick={() => saveMSDoc()}>
						<IonIcon icon={saveOutline} className="ion-padding-end" />
						<IonLabel>Save MorphoSyntax Info</IonLabel>
					</IonItem>
					<IonItem button={true} onClick={() => saveMSNew()}>
						<IonIcon icon={saveOutline} className="ion-padding-end" />
						<IonLabel>Save As New</IonLabel>
					</IonItem>
					<IonItem button={true} onClick={() => maybeExportMS()}>
						<IonIcon icon={codeDownloadOutline} className="ion-padding-end" />
						<IonLabel>Export MorphoSyntax Info</IonLabel>
					</IonItem>
					<IonItem button={true} onClick={() => openMSModal("DeleteMS")}>
						<IonIcon icon={trashOutline} className="ion-padding-end" />
						<IonLabel>Delete Saved MorphoSyntax Info</IonLabel>
					</IonItem>
				</IonList>
			</IonContent>
		</IonPage>
	);
};
