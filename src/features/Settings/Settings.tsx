import React, { useState, useEffect } from 'react';
import { IonToggle, IonItem, IonLabel, IonList } from '@ionic/react';
import { PageHeader } from '../../components/common';
import { useAppSelector } from '../../redux';
import { selectControllerName } from '../../redux';
import { settingsService } from '../../firebase/services';
import { useToast } from '../../hooks';

interface PlayerSettings {
  autoadvance: boolean;
  userpick: boolean;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<PlayerSettings>({
    autoadvance: false,
    userpick: false
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const controllerName = useAppSelector(selectControllerName);
  const { showSuccess, showError } = useToast();

  // Load settings on mount
  useEffect(() => {
    if (controllerName) {
      loadSettings();
    }
  }, [controllerName]);

  const loadSettings = async () => {
    if (!controllerName) return;
    
    try {
      setIsLoading(true);
      const currentSettings = await settingsService.getSettings(controllerName);
      if (currentSettings) {
        setSettings(currentSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      showError('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = async (setting: keyof PlayerSettings, value: boolean) => {
    if (!controllerName) return;
    
    try {
      await settingsService.updateSetting(controllerName, setting, value);
      setSettings(prev => ({ ...prev, [setting]: value }));
      showSuccess(`${setting === 'autoadvance' ? 'Auto-advance' : 'User pick'} setting updated`);
    } catch (error) {
      console.error('Failed to update setting:', error);
      showError('Failed to update setting');
      // Revert the change on error
      setSettings(prev => ({ ...prev, [setting]: !value }));
    }
  };

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Configure player behavior"
      />

      <div className="max-w-4xl mx-auto p-6">
        <IonList>
          <IonItem>
            <IonLabel>
              <h3>Auto-advance Queue</h3>
              <p>Automatically advance to the next song when the current song finishes</p>
            </IonLabel>
            <IonToggle
              slot="end"
              checked={settings.autoadvance}
              onIonChange={(e) => handleSettingChange('autoadvance', e.detail.checked)}
              disabled={isLoading}
            />
          </IonItem>
          
          <IonItem>
            <IonLabel>
              <h3>User Pick Mode</h3>
              <p>Allow users to pick their own songs from the queue</p>
            </IonLabel>
            <IonToggle
              slot="end"
              checked={settings.userpick}
              onIonChange={(e) => handleSettingChange('userpick', e.detail.checked)}
              disabled={isLoading}
            />
          </IonItem>
        </IonList>
      </div>
    </>
  );
};

export default Settings; 