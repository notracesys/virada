import { KeyRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { initializeFirebase } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AccessCode } from "@/types";
import { GenerateCodeForm } from "./components/generate-code-form";

async function getAccessCodes(): Promise<AccessCode[]> {
    try {
        const { firestore } = initializeFirebase();
        const codesCollection = collection(firestore, 'access_codes');
        const q = query(codesCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const codes = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                email: data.email,
                isUsed: data.isUsed,
                createdAt: data.createdAt?.toDate ? format(data.createdAt.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : 'N/A',
                usedAt: data.usedAt?.toDate ? format(data.usedAt.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : null,
                generatedNumbers: data.generatedNumbers,
            } as AccessCode;
        });

        return codes;
    } catch (error) {
        console.error("Error fetching access codes: ", error);
        return [];
    }
}


export default async function AdminCodesPage() {
    const codes = await getAccessCodes();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline text-foreground flex items-center gap-2">
                <KeyRound className="w-8 h-8" />
                Gerenciar Códigos de Acesso
            </h1>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Gerar Novo Código</CardTitle>
                        <CardDescription>Insira o e-mail do cliente para criar um novo código de acesso único.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <GenerateCodeForm />
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Códigos Gerados</CardTitle>
                        <CardDescription>Lista de todos os códigos de acesso criados.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Código</TableHead>
                                    <TableHead>E-mail</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Criado em</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {codes.map((code) => (
                                    <TableRow key={code.id}>
                                        <TableCell className="font-mono">{code.id}</TableCell>
                                        <TableCell>{code.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={code.isUsed ? 'destructive' : 'default'}>
                                                {code.isUsed ? 'Usado' : 'Disponível'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{code.createdAt}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
