'use client';

import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { User } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

function UsersTable({ users, isLoading }: { users: User[] | null, isLoading: boolean }) {
    if (isLoading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-2">
                        <Skeleton className="h-4 flex-grow" />
                        <Skeleton className="h-4 flex-grow" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                ))}
            </div>
        );
    }

    if (!users || users.length === 0) {
        return <p className="text-center text-muted-foreground py-8">Nenhum usuário encontrado.</p>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID do Usuário</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Data de Registro</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-mono">{user.id}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.registrationDate}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default function AdminUsersPage() {
    const firestore = useFirestore();

    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'users'), orderBy('registrationDate', 'desc'));
    }, [firestore]);

    const { data: rawUsers, isLoading } = useCollection(usersQuery);

    const users: User[] | null = useMemoFirebase(() => {
        if (!rawUsers) return null;
        return rawUsers.map(doc => ({
            id: doc.id,
            email: doc.email,
            // @ts-ignore
            registrationDate: doc.registrationDate?.toDate ? format(doc.registrationDate.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : 'N/A',
        }));
    }, [rawUsers]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline text-foreground flex items-center gap-2">
                <Users className="w-8 h-8" />
                Gerenciar Usuários
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>Usuários Cadastrados</CardTitle>
                    <CardDescription>Lista de todos os usuários registrados na plataforma.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UsersTable users={users} isLoading={isLoading} />
                </CardContent>
            </Card>
        </div>
    );
}
