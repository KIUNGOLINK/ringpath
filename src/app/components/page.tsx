"use client";

import { Button, IconButton } from "@/components/ui/Button";
import { TextField, SearchField, TextArea } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { Tabs } from "@/components/ui/Tabs";
import { Switch } from "@/components/ui/Switch";
import { BellIcon } from "@/components/icons/Icon";

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] text-smoke mb-2">{children}</div>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[13px] font-semibold tracking-[0.06em] text-smoke uppercase mb-6">
      {children}
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <div className="px-6 md:px-[72px] py-16 pb-32 max-w-[1296px] mx-auto">
      <div className="text-xs tracking-[0.08em] text-smoke uppercase mb-2">Partie XI–XII</div>
      <h1 className="text-[56px] leading-[60px] font-bold text-bone mb-16">Components</h1>

      {/* buttons */}
      <div className="mb-16">
        <SectionLabel>Buttons</SectionLabel>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 items-start">
          <div>
            <Label>Primary</Label>
            <Button variant="primary">Continue</Button>
          </div>
          <div>
            <Label>Red CTA</Label>
            <Button variant="red">Confirm Fight</Button>
          </div>
          <div>
            <Label>Secondary</Label>
            <Button variant="secondary">Learn more</Button>
          </div>
          <div>
            <Label>Tertiary</Label>
            <Button variant="tertiary">See how it works</Button>
          </div>
          <div>
            <Label>Primary — Disabled</Label>
            <Button variant="primary" disabled>
              Continue
            </Button>
          </div>
          <div>
            <Label>Small (44px touch target)</Label>
            <div className="w-11 h-11 flex items-center justify-center border border-dashed border-[#474747] rounded-md">
              <Button variant="small">View</Button>
            </div>
          </div>
          <div>
            <Label>Icon button</Label>
            <IconButton>
              <BellIcon size={20} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* inputs */}
      <div className="mb-16">
        <SectionLabel>Inputs</SectionLabel>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-[900px] mb-6">
          <TextField label="First name" defaultValue="Yanis" />
          <TextField label="Focused" defaultValue="Kader" autoFocus />
          <TextField label="Error" defaultValue="birthdate" error="Enter a valid date" />
        </div>
        <div className="grid sm:grid-cols-2 gap-8 max-w-[600px] mb-6">
          <SearchField placeholder="Search coach" />
          <TextArea placeholder="Notes, optional…" />
        </div>
        <div className="flex gap-3 flex-wrap mb-8">
          <Chip>ORTHODOX</Chip>
          <Chip>71 KG</Chip>
          <Chip>FRANCE</Chip>
        </div>
        <div className="max-w-md mb-8">
          <Tabs tabs={["Overview", "Schedule", "Sparring"]}>{() => null}</Tabs>
        </div>
        <div className="flex items-center gap-4">
          <Switch defaultChecked />
          <Switch />
        </div>
      </div>
    </div>
  );
}
