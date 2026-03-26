'use client'

import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Switch } from '@/src/components/ui/switch'
import { Separator } from '@/src/components/ui/separator'
import { User, Bell, Shield, Mail } from 'lucide-react'

export function ProfileSettings() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings and notification preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-base font-semibold text-card-foreground">
            Account Information
          </h2>
        </div>

        <div className="flex items-start gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-foreground">
            JD
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  defaultValue="John"
                  className="bg-secondary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  defaultValue="Doe"
                  className="bg-secondary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="john@company.com"
                className="bg-secondary"
              />
            </div>
            <Button>Update Profile</Button>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-base font-semibold text-card-foreground">
            Notification Preferences
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              id: 'critical',
              title: 'Critical Errors',
              description: 'Get notified immediately for critical errors',
              defaultChecked: true,
            },
            {
              id: 'daily',
              title: 'Daily Digest',
              description: 'Receive a daily summary of all errors',
              defaultChecked: true,
            },
            {
              id: 'weekly',
              title: 'Weekly Report',
              description: 'Get a weekly analytics report',
              defaultChecked: false,
            },
            {
              id: 'resolved',
              title: 'Error Resolved',
              description: 'Notify when an error is marked as resolved',
              defaultChecked: false,
            },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg bg-secondary/50 p-4"
            >
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
              <Switch defaultChecked={item.defaultChecked} />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-base font-semibold text-card-foreground">
            Security
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              className="max-w-md bg-secondary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              className="max-w-md bg-secondary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              className="max-w-md bg-secondary"
            />
          </div>
          <Button>Change Password</Button>
        </div>

        <Separator className="my-6" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-card-foreground">
              Two-Factor Authentication
            </p>
            <p className="text-xs text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
          <Button variant="outline">Enable 2FA</Button>
        </div>
      </div>
    </div>
  )
}
