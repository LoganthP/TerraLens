import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type AppRole = 'admin' | 'officer' | 'citizen';

interface UserWithRole {
  id: string;
  displayName: string;
  email: string;
  role: AppRole;
}

// Mock data for demonstration (will be replaced with real data when auth is implemented)
const mockUsers: UserWithRole[] = [
  { id: '1', displayName: 'Loganth', email: 'loganthp55@gmail.com', role: 'admin' },
  { id: '2', displayName: 'Test User', email: 'testuser123@example.com', role: 'officer' },
  { id: '3', displayName: 'John Doe', email: 'johndoe@example.com', role: 'citizen' },
];

const roleColors: Record<AppRole, string> = {
  admin: 'bg-destructive/10 text-destructive border-destructive/20',
  officer: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  citizen: 'bg-muted text-muted-foreground border-border'
};

export function UserRolesManager() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>(mockUsers);

  const handleRoleChange = (userId: string, newRole: AppRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    
    const user = users.find(u => u.id === userId);
    toast({
      title: "Role Updated",
      description: `${user?.displayName}'s role has been changed to ${newRole}.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle>User Roles</CardTitle>
        </div>
        <CardDescription>
          Manage user access levels. Admins have full access, Officers can manage records, Citizens have limited access.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.displayName}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn("capitalize", roleColors[user.role])}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Select
                    value={user.role}
                    onValueChange={(value: AppRole) => handleRoleChange(user.id, value)}
                  >
                    <SelectTrigger className="w-32 ml-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="officer">Officer</SelectItem>
                      <SelectItem value="citizen">Citizen</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
