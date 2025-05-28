import React, { useState, useEffect } from 'react';
import { Company, User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, Users } from 'lucide-react';

interface CompanyFormProps {
  company?: Company | null;
  onSubmit: (data: Partial<Company>) => void;
  onCancel: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ company, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<Company>>({
    companyName: '',
    companyAddress: '',
    drive: '',
    typeOfDrive: '',
    followUp: '',
    isContacted: false,
    remarks: '',
    contactDetails: '',
    hr1Details: '',
    hr2Details: '',
    package: '',
    assignedOfficer: '',
  });

  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/user/list');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setAvailableUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        // Optionally set an empty array or show error state
        setAvailableUsers([]);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (company) {
      setFormData(company);
    }
  }, [company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert "unassigned" back to empty string for data consistency
    const submitData = {
      ...formData,
      assignedOfficer: formData.assignedOfficer === 'unassigned' ? '' : formData.assignedOfficer
    };
    onSubmit(submitData);
  };

  const handleChange = (field: keyof Company, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canAssignUsers = user?.role === 'Admin' || user?.role === 'Manager';

  const getSelectedUser = () => {
    return availableUsers.find(u => u.username === formData.assignedOfficer);
  };

  const getDisplayValue = () => {
    if (!formData.assignedOfficer || formData.assignedOfficer === 'unassigned') {
      return 'unassigned';
    }
    return formData.assignedOfficer;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="package">Package</Label>
          <Input
            id="package"
            value={formData.package}
            onChange={(e) => handleChange('package', e.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="companyAddress">Company Address</Label>
          <Textarea
            id="companyAddress"
            value={formData.companyAddress}
            onChange={(e) => handleChange('companyAddress', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="drive">Drive</Label>
          <Input
            id="drive"
            value={formData.drive}
            onChange={(e) => handleChange('drive', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="typeOfDrive">Type of Drive</Label>
          <Select value={formData.typeOfDrive} onValueChange={(value) => handleChange('typeOfDrive', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select drive type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="On-Campus">On-Campus</SelectItem>
              <SelectItem value="Off-Campus">Off-Campus</SelectItem>
              <SelectItem value="Virtual">Virtual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="followUp">Follow Up</Label>
          <Input
            id="followUp"
            value={formData.followUp}
            onChange={(e) => handleChange('followUp', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactDetails">Contact Details</Label>
          <Input
            id="contactDetails"
            value={formData.contactDetails}
            onChange={(e) => handleChange('contactDetails', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hr1Details">HR1 Details</Label>
          <Input
            id="hr1Details"
            value={formData.hr1Details}
            onChange={(e) => handleChange('hr1Details', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hr2Details">HR2 Details</Label>
          <Input
            id="hr2Details"
            value={formData.hr2Details}
            onChange={(e) => handleChange('hr2Details', e.target.value)}
          />
        </div>

        {canAssignUsers && (
          <div className="space-y-3 md:col-span-2">
            <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 backdrop-blur-sm border border-blue-200/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100/80 rounded-full backdrop-blur-sm">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <Label className="text-base font-semibold text-blue-900">Assign Officer/Manager</Label>
              </div>
              
              <Select value={getDisplayValue()} onValueChange={(value) => handleChange('assignedOfficer', value)}>
                <SelectTrigger className="bg-white/80 backdrop-blur-sm border-blue-200/50 hover:bg-white/90 transition-all duration-200">
                  <SelectValue placeholder="Select user to assign">
                    {formData.assignedOfficer && formData.assignedOfficer !== 'unassigned' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium">{getSelectedUser()?.username}</span>
                        <Badge variant="outline" className="text-xs bg-blue-50/80 text-blue-700 border-blue-200">
                          {getSelectedUser()?.role}
                        </Badge>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-blue-200/50">
                  <SelectItem value="unassigned" className="hover:bg-blue-50/50">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserIcon className="h-3 w-3 text-gray-400" />
                      </div>
                      <span className="text-gray-500">Unassigned</span>
                    </div>
                  </SelectItem>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.username} className="hover:bg-blue-50/50">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="font-medium">{user.username}</span>
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {user.role}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {formData.assignedOfficer && formData.assignedOfficer !== 'unassigned' && (
                <div className="mt-3 p-3 bg-white/60 backdrop-blur-sm rounded-md border border-blue-200/30">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-900">{getSelectedUser()?.username}</p>
                      <p className="text-xs text-blue-600">{getSelectedUser()?.email}</p>
                      <Badge variant="outline" className="text-xs mt-1 bg-blue-50/80 text-blue-700 border-blue-200">
                        {getSelectedUser()?.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isContacted"
            checked={formData.isContacted}
            onCheckedChange={(checked) => handleChange('isContacted', checked)}
          />
          <Label htmlFor="isContacted">Company Contacted</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {company ? 'Update Company' : 'Create Company'}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;
