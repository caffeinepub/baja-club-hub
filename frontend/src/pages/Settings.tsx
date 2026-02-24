import React from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, Palette } from 'lucide-react';

export default function Settings() {
  const settingsSections = [
    {
      icon: User,
      title: 'Profile',
      description: 'Manage your name, email, and personal information.',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure how and when you receive notifications.',
    },
    {
      icon: Lock,
      title: 'Privacy & Security',
      description: 'Control your account security and data privacy settings.',
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize the look and feel of your BAJA experience.',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Hero */}
      <div className="bg-carbon-black border-b border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <SettingsIcon className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your account settings and preferences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-4 sm:grid-cols-2">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="
                  group p-6 rounded-xl border border-border/60 bg-carbon-black/50
                  hover:border-primary/40 hover:bg-primary/5
                  transition-all duration-200 cursor-pointer
                "
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-6 rounded-xl border border-border/40 bg-muted/20 text-center">
          <p className="text-muted-foreground text-sm">
            Full settings management is coming soon. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
}
