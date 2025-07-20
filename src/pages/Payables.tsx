
import { useState } from 'react';
import { Plus, Search, Filter, Calendar, CheckCircle, XCircle, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import { usePayables } from '@/hooks/usePayables';
import { useCategories } from '@/hooks/useCategories';
import { PayableForm } from '@/components/forms/PayableForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Payables() {
  const { payables, loading, updatePayable, deletePayable } = usePayables();
  const { categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Apply filters
  const filteredPayables = payables.filter(payable => {
    const matchesSearch = payable.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (payable.description && payable.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || payable.category_id === selectedCategory;
    
    let matchesStatus = true;
    if (statusFilter === 'paid') matchesStatus = payable.is_paid || false;
    if (statusFilter === 'pending') matchesStatus = !(payable.is_paid || false);
    if (statusFilter === 'overdue') {
      const dueDate = parseISO(payable.due_date);
      matchesStatus = !(payable.is_paid || false) && isBefore(dueDate, new Date());
    }
    if (statusFilter === 'due-soon') {
      const dueDate = parseISO(payable.due_date);
      const next7Days = addDays(new Date(), 7);
      matchesStatus = !(payable.is_paid || false) && isAfter(dueDate, new Date()) && isBefore(dueDate, next7Days);
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: payables.length,
    paid: payables.filter(p => p.is_paid).length,
    pending: payables.filter(p => !p.is_paid).length,
    overdue: payables.filter(p => {
      const dueDate = parseISO(p.due_date);
      return !p.is_paid && isBefore(dueDate, new Date());
    }).length,
    totalAmount: payables.reduce((sum, p) => sum + Number(p.amount), 0),
    pendingAmount: payables.filter(p => !p.is_paid).reduce((sum, p) => sum + Number(p.amount), 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
  };

  const togglePaymentStatus = async (payableId: string) => {
    const payable = payables.find(p => p.id === payableId);
    if (payable) {
      await updatePayable(payableId, { 
        is_paid: !payable.is_paid,
        paid_date: !payable.is_paid ? new Date().toISOString().split('T')[0] : null
      });
    }
  };

  const handleDelete = async (id: string) => {
    await deletePayable(id);
  };

  const getPayableStatus = (payable: typeof payables[0]) => {
    if (payable.is_paid) return { text: 'Pago', variant: 'default' as const, icon: CheckCircle };
    
    const dueDate = parseISO(payable.due_date);
    const today = new Date();
    const next7Days = addDays(today, 7);
    
    if (isBefore(dueDate, today)) {
      return { text: 'Vencido', variant: 'destructive' as const, icon: XCircle };
    }
    
    if (isBefore(dueDate, next7Days)) {
      return { text: 'Vence em breve', variant: 'secondary' as const, icon: AlertTriangle };
    }
    
    return { text: 'Pendente', variant: 'outline' as const, icon: Clock };
  };

  // Get expense categories
  const expenseCategories = categories.filter(category => 
    category.name.toLowerCase().includes('despesa') || 
    category.name.toLowerCase().includes('conta') ||
    category.name.toLowerCase().includes('pagamento')
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando contas a pagar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Contas a Pagar</h1>
          <p className="text-muted-foreground">
            Gerencie suas contas e compromissos financeiros
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Conta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Conta a Pagar</DialogTitle>
            </DialogHeader>
            <PayableForm onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Contas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.paid} pagas, {stats.pending} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              Todas as contas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Pendente</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.pendingAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.pending} contas pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção imediata
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar contas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="paid">Pagas</SelectItem>
                  <SelectItem value="overdue">Vencidas</SelectItem>
                  <SelectItem value="due-soon">Vencem em breve</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payables List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Contas a Pagar</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPayables.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma conta encontrada</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== 'all' || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros ou adicione uma nova conta.'
                  : 'Comece adicionando sua primeira conta a pagar.'}
              </p>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Conta
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Conta a Pagar</DialogTitle>
                  </DialogHeader>
                  <PayableForm onSuccess={handleFormSuccess} />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPayables.map((payable) => {
                const status = getPayableStatus(payable);
                const StatusIcon = status.icon;
                const dueDate = parseISO(payable.due_date);
                const category = categories.find(cat => cat.id === payable.category_id);
                
                return (
                  <div
                    key={payable.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{payable.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge variant="secondary">
                              {category?.name || 'Sem categoria'}
                            </Badge>
                            <Badge variant={status.variant} className="flex items-center gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {status.text}
                            </Badge>
                          </div>
                          {payable.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {payable.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right sm:hidden">
                          <div className="text-lg font-semibold">
                            {formatCurrency(Number(payable.amount))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Vencimento: {format(dueDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </div>
                        {!payable.is_paid && (
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={payable.is_paid || false}
                              onCheckedChange={() => togglePaymentStatus(payable.id)}
                            />
                            <span className="text-xs">Marcar como pago</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {formatCurrency(Number(payable.amount))}
                        </div>
                        {payable.is_paid && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePaymentStatus(payable.id)}
                            className="mt-2"
                          >
                            Marcar como pendente
                          </Button>
                        )}
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a conta "{payable.title}"?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(payable.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
