'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserData } from '@/hooks/userData';
import { useState } from 'react';

interface Event {
  _id: string;
  name: string;
  dateCreated: string;
  status: string;
  emailHr: string;
  emailVendor: string;
  ProposedDate: string[];
  confirmedDate: string;
  remarks: string;
  postalCode: string;
  address: string;
  __v: number;
}

interface DialogDemoProps {
  data: Event;
}

export function DialogDemo({ data }: DialogDemoProps) {
  const [name, setName] = useState(data.name);
  const [status, setStatus] = useState(data.status);
  const [emailHr, setEmailHr] = useState(data.emailHr);
  const [emailVendor, setEmailVendor] = useState(data.emailVendor);
  const [confirmedDate, setConfirmedDate] = useState(data.confirmedDate);
  const [remarks, setRemarks] = useState(data.remarks);
  const [selectedDate, setSelectedDate] = useState(data.ProposedDate[0]);
  const [showRemarks, setShowRemarks] = useState(false);
  const [postalCode, setPostalCode] = useState(data.postalCode);
  const [address, setAddress] = useState(data.address);

  // Handle form submission
  const handleSave = async (isAccepted: boolean) => {
    const updatedStatus = isAccepted ? 'accept' : 'rejected';
    const updatedConfirmedDate = isAccepted ? selectedDate : ''; // Clear confirmedDate if rejected

    const updatedEvent = {
      ...data,
      name,
      status: updatedStatus,
      confirmedDate: updatedConfirmedDate,
      remarks
    };

    // Send the updated event to the server
    try {
      const response = await fetch(
        `http://localhost:3000/event/update/${data._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedEvent)
        }
      );

      if (response.ok) {
        console.log('Event updated successfully');
        window.location.reload();
      } else {
        console.error('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const { role } = useUserData();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Event Detail</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Event Detail</DialogTitle>
          <DialogDescription>
            Make changes to the event here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {!showRemarks && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Input
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emailHr" className="text-right">
                HR Email
              </Label>
              <Input
                id="emailHr"
                value={emailHr}
                onChange={(e) => setEmailHr(e.target.value)}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emailVendor" className="text-right">
                Vendor Email
              </Label>
              <Input
                id="emailVendor"
                value={emailVendor}
                onChange={(e) => setEmailVendor(e.target.value)}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proposedDate" className="text-right">
                Proposed Date
              </Label>
              <select
                id="proposedDate"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="col-span-3 rounded border px-2 py-1"
                disabled={showRemarks}
              >
                {data.ProposedDate.map((date, index) => (
                  <option key={index} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="postalCode" className="text-right">
                Postal Code
              </Label>
              <Input
                id="emailVendor"
                value={postalCode}
                // onChange={(e) => setEmailVendor(e.target.value)}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="emailVendor"
                value={address}
                // onChange={(e) => setEmailVendor(e.target.value)}
                className="col-span-3"
                disabled
              />
            </div>
          </div>
        )}
        {showRemarks && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remarks" className="text-right">
              Remarks
            </Label>
            <Input
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="col-span-3"
            />
          </div>
        )}
        {!showRemarks && role === 'vendor' && (
          <DialogFooter>
            <Button
              type="button"
              onClick={() => handleSave(true)}
              className="bg-green-400"
            >
              Accept
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowRemarks(true);
              }}
              className="bg-red-400"
            >
              Reject
            </Button>
          </DialogFooter>
        )}
        {showRemarks && role === 'vendor' && (
          <Button
            type="button"
            onClick={() => {
              handleSave(false);
            }}
            className="bg-red-400"
          >
            Reject
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
