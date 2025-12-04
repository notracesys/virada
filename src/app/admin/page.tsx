import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Users, Ticket } from "lucide-react";

const mockGenerations = [
  { id: 'usr_1a2b', numbers: [7, 19, 24, 28, 41, 55], date: '2024-07-20 23:15:01' },
  { id: 'usr_3c4d', numbers: [4, 11, 33, 39, 48, 51], date: '2024-07-20 23:14:22' },
  { id: 'usr_5e6f', numbers: [10, 21, 22, 45, 53, 60], date: '2024-07-20 23:12:59' },
  { id: 'usr_7g8h', numbers: [2, 18, 27, 34, 44, 58], date: '2024-07-20 23:11:04' },
  { id: 'usr_9i0j', numbers: [5, 15, 25, 35, 45, 55], date: '2024-07-20 23:09:48' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline text-primary">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-black/50 border-red-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">R$ 45.231,89</div>
            <p className="text-xs text-muted-foreground">+20.1% do último mês</p>
          </CardContent>
        </Card>
        <Card className="bg-black/50 border-red-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">+2.350</div>
            <p className="text-xs text-muted-foreground">+180.1% do último mês</p>
          </CardContent>
        </Card>
        <Card className="bg-black/50 border-red-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Gerações Hoje</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">+573</div>
            <p className="text-xs text-muted-foreground">+19% da última hora</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-black/50 border-red-900/50">
        <CardHeader>
          <CardTitle>Gerações Recentes</CardTitle>
          <CardDescription>Análise das últimas solicitações ao sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-red-900/20 border-red-900/50">
                <TableHead>ID do Usuário</TableHead>
                <TableHead>Números Gerados</TableHead>
                <TableHead>Data/Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockGenerations.map((gen) => (
                <TableRow key={gen.id} className="hover:bg-red-900/20 border-red-900/50">
                  <TableCell className="font-medium text-accent">{gen.id}</TableCell>
                  <TableCell className="font-code text-primary">{gen.numbers.join(' - ')}</TableCell>
                  <TableCell className="text-muted-foreground">{gen.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
