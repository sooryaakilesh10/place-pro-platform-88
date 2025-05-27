
import React, { useState, useEffect } from 'react';
import { PendingUpdate } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Check, Trash } from 'lucide-react';

const Approvals: React.FC = () => {
  const { user } = useAuth();
  const [pendingUpdates, setPendingUpdates] = useState<PendingUpdate[]>([]);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockPendingUpdates: PendingUpdate[] = [
      {
        id: '1',
        companyID: '1',
        originalData: {
          companyID: '1',
          companyName: 'Tech Solutions Inc',
          companyAddress: '123 Tech Street, Silicon Valley, CA',
          drive: 'Campus Drive 2024',
          typeOfDrive: 'On-Campus',
          followUp: 'Follow up next week',
          isContacted: true,
          remarks: 'Interested in CS students',
          contactDetails: 'hr@techsolutions.com',
          hr1Details: 'John Doe - 555-0101',
          hr2Details: 'Jane Smith - 555-0102',
          package: '12 LPA',
          assignedOfficer: 'officer',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-20T14:45:00Z'
        },
        proposedChanges: {
          package: '15 LPA',
          remarks: 'Interested in CS students. Updated package information.',
          contactDetails: 'hr@techsolutions.com, recruiter@techsolutions.com'
        },
        requestedBy: 'officer',
        requestedAt: '2024-01-25T09:30:00Z',
        status: 'pending'
      },
      {
        id: '2',
        companyID: '2',
        originalData: {
          companyID: '2',
          companyName: 'Digital Innovations Ltd',
          companyAddress: '456 Innovation Drive, Austin, TX',
          drive: 'Virtual Drive 2024',
          typeOfDrive: 'Virtual',
          followUp: 'Awaiting response',
          isContacted: false,
          remarks: 'Looking for software engineers',
          contactDetails: 'careers@digitalinnovations.com',
          hr1Details: 'Mike Johnson - 555-0201',
          hr2Details: 'Sarah Wilson - 555-0202',
          package: '15 LPA',
          assignedOfficer: '',
          createdAt: '2024-01-10T09:15:00Z',
          updatedAt: '2024-01-18T16:20:00Z'
        },
        proposedChanges: {
          isContacted: true,
          followUp: 'Scheduled interview for next week',
          remarks: 'Looking for software engineers. Initial contact made.'
        },
        requestedBy: 'officer',
        requestedAt: '2024-01-24T14:15:00Z',
        status: 'pending'
      }
    ];
    setPendingUpdates(mockPendingUpdates);
  }, []);

  const handleApprove = (updateId: string) => {
    setPendingUpdates(prev => prev.map(update => 
      update.id === updateId 
        ? { 
            ...update, 
            status: 'approved', 
            reviewedBy: user?.username,
            reviewedAt: new Date().toISOString()
          }
        : update
    ));
    
    toast({
      title: "Update Approved",
      description: "The company update has been approved and applied.",
    });
  };

  const handleReject = (updateId: string) => {
    setPendingUpdates(prev => prev.map(update => 
      update.id === updateId 
        ? { 
            ...update, 
            status: 'rejected', 
            reviewedBy: user?.username,
            reviewedAt: new Date().toISOString()
          }
        : update
    ));
    
    toast({
      title: "Update Rejected",
      description: "The company update has been rejected.",
      variant: "destructive"
    });
  };

  const pendingOnly = pendingUpdates.filter(update => update.status === 'pending');

  if (user?.role === 'Officer') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">Only administrators and managers can approve updates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-gray-600">Review and approve officer updates to company data</p>
      </div>

      {pendingOnly.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">No Pending Approvals</h3>
              <p className="text-gray-600">All updates have been reviewed.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingOnly.map((update) => (
            <Card key={update.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Update for {update.originalData.companyName}
                    </CardTitle>
                    <CardDescription>
                      Requested by {update.requestedBy} on {new Date(update.requestedAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Proposed Changes:</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {Object.entries(update.proposedChanges).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="text-green-600">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleReject(update.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button onClick={() => handleApprove(update.id)}>
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Approvals;
