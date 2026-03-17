<template>
  <div class="space-y-4">
    <AdminSectionHeader
      title="Gestion des Utilisateurs"
      action-label="Ajouter un utilisateur"
      action-icon="pi pi-plus"
      @action="openCreateDialog"
    />

    <!-- DataTable -->
    <DataTable
      :value="filteredUsers"
      :loading="isLoading"
      paginator
      :rows="10"
      responsive-layout="scroll"
      class="custom-datatable"
      striped-rows
      sortMode="multiple"
    >
      <template #header>
        <AdminTableToolbar
          v-model:search-value="userSearch"
          v-model:filter-value="userRoleFilter"
          :filter-options="userRoleFilterOptions"
          search-placeholder="Rechercher (id, login, email)"
          filter-placeholder="Filtre role"
          @reset="resetUserTableFilters"
        />
      </template>

      <Column field="userId" header="ID" style="width: 10%" sortable>
        <template #body="slotProps">
          <span class="text-xs bg-gray-100 px-2 py-1 rounded">{{ slotProps.data.userId }}</span>
        </template>
      </Column>
      <Column field="login" header="Login" style="width: 20%" sortable />
      <Column field="email" header="Email" style="width: 25%" sortable />
      <Column field="isAdmin" header="Admin" style="width: 10%" sortable>
        <template #body="slotProps">
          <Tag :value="slotProps.data.isAdmin ? 'Oui' : 'Non'" :severity="slotProps.data.isAdmin ? 'success' : 'info'" />
        </template>
      </Column>
      <Column field="isSuperAdmin" header="Super Admin" style="width: 10%" sortable>
        <template #body="slotProps">
          <Tag :value="slotProps.data.isSuperAdmin ? 'Oui' : 'Non'" :severity="slotProps.data.isSuperAdmin ? 'warning' : 'info'" />
        </template>
      </Column>
      <Column header="Actions" style="width: 25%">
        <template #body="slotProps">
          <Button
            icon="pi pi-shopping-cart"
            severity="secondary"
            rounded
            text
            @click="openUserOrdersDialog(slotProps.data)"
            class="mr-2"
          />
          <Button
            icon="pi pi-pencil"
            severity="info"
            rounded
            text
            @click="editUser(slotProps.data)"
            class="mr-2"
          />
          <Button
            icon="pi pi-trash"
            severity="danger"
            rounded
            text
            @click="deleteUser(slotProps.data.userId)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- Dialog Create/Edit -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="dialogMode === 'create' ? 'Ajouter un utilisateur' : 'Modifier l\'utilisateur'"
      :modal="true"
      class="w-full md:w-1/2"
      @hide="resetForm"
    >
      <form @submit.prevent="saveUser" class="space-y-4">
        <div>
          <label for="login" class="block text-sm font-medium text-gray-700 mb-1">
            Login <span class="text-red-500">*</span>
          </label>
          <InputText id="login" v-model="formData.login" type="text" class="w-full" placeholder="Nom d'utilisateur" />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email <span class="text-red-500">*</span>
          </label>
          <InputText id="email" v-model="formData.email" type="email" class="w-full" placeholder="email@exemple.com" />
        </div>

        <div v-if="dialogMode === 'create'">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe <span class="text-red-500">*</span>
          </label>
          <InputText
            id="password"
            v-model="formData.password"
            type="password"
            class="w-full"
            placeholder="Mot de passe"
          />
        </div>

        <div class="flex gap-4">
          <div class="flex items-center">
            <Checkbox id="isAdmin" v-model="formData.isAdmin" binary />
            <label for="isAdmin" class="ml-2 text-sm font-medium text-gray-700">Admin</label>
          </div>
          <div class="flex items-center">
            <Checkbox id="isSuperAdmin" v-model="formData.isSuperAdmin" binary />
            <label for="isSuperAdmin" class="ml-2 text-sm font-medium text-gray-700">Super Admin</label>
          </div>
        </div>
      </form>

      <template #footer>
        <Button label="Annuler" severity="secondary" @click="dialogVisible = false" />
        <Button label="Sauvegarder" @click="saveUser" :loading="isSaving" />
      </template>
    </Dialog>

    <!-- Dialog User Orders -->
    <Dialog
      v-model:visible="ordersDialogVisible"
      :header="selectedOrdersUser ? `Commandes de ${selectedOrdersUser.login}` : 'Commandes utilisateur'"
      :modal="true"
      class="w-full md:w-3/4"
      @hide="resetOrdersState"
    >
      <DataTable
        :value="filteredUserOrders"
        :loading="ordersLoading"
        paginator
        :rows="8"
        responsive-layout="scroll"
        class="custom-datatable"
        striped-rows
        sortMode="multiple"
      >
        <template #header>
          <AdminTableToolbar
            v-model:search-value="orderSearch"
            v-model:filter-value="orderStatusFilter"
            :filter-options="orderStatusFilterOptions"
            search-placeholder="Rechercher (id commande, statut, lieu/equipement)"
            filter-placeholder="Filtre statut"
            @reset="resetOrderTableFilters"
          />
        </template>

        <Column field="orderId" header="ID commande" style="width: 20%" sortable />
        <Column header="Statut" style="width: 20%" sortable sortField="statusId">
          <template #body="slotProps">
            <Tag :value="getOrderStatusLabel(slotProps.data.statusId)" severity="info" />
          </template>
        </Column>
        <Column header="Lieux / Equipements reservés" style="width: 35%">
          <template #body="slotProps">
            <ul class="text-sm text-gray-700 list-disc pl-4 space-y-1">
              <li
                v-for="(reservation, index) in getOrderReservationsList(slotProps.data.orderId)"
                :key="`${slotProps.data.orderId}-${index}`"
              >
                {{ reservation }}
              </li>
            </ul>
          </template>
        </Column>
        <Column header="Actions" style="width: 25%">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              severity="info"
              rounded
              text
              @click="editOrder(slotProps.data)"
              class="mr-2"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              rounded
              text
              @click="deleteOrderAction(slotProps.data.orderId)"
            />
          </template>
        </Column>
      </DataTable>

      <AdminEmptyState
        v-if="!ordersLoading && selectedUserOrders.length === 0"
        message="Aucune commande pour cet utilisateur"
        container-class="py-8"
      />
    </Dialog>

    <!-- Dialog Edit Order -->
    <Dialog
      v-model:visible="orderDialogVisible"
      header="Modifier la commande"
      :modal="true"
      class="w-full md:w-1/2"
      @hide="resetOrderForm"
    >
      <form @submit.prevent="saveOrder" class="space-y-4">
        <div>
          <label for="orderStatusId" class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <Dropdown
            id="orderStatusId"
            v-model="orderForm.statusId"
            :options="orderStatusOptions"
            option-label="label"
            option-value="value"
            placeholder="Selectionner un statut"
            class="w-full"
          />
        </div>
      </form>

      <template #footer>
        <Button label="Annuler" severity="secondary" @click="orderDialogVisible = false" />
        <Button label="Sauvegarder" @click="saveOrder" :loading="isOrderSaving" />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Tag from 'primevue/tag';
import Dropdown from 'primevue/dropdown';
import AdminEmptyState from '@/ui/components/admin/components/AdminEmptyState.vue';
import AdminSectionHeader from '@/ui/components/admin/components/AdminSectionHeader.vue';
import AdminTableToolbar from '@/ui/components/admin/components/AdminTableToolbar.vue';
import { getUsers, createUser, updateUser, deleteUser } from '@/services/user';
import {
  getOrders,
  updateOrder as updateOrderService,
  deleteOrder as deleteOrderService,
} from '@/services/order';
import { getOrderStatuses } from '@/services/orderStatus';
import { getOrderItems } from '@/services/orderItem';
import { getDomains } from '@/services/domain';
import { getEquipementsCompany } from '@/services/equipementCompany';
import { useAuthStore } from '@/stores/authStore';
import type { User, CreateUser } from '@/types/user';
import type { Order } from '@/types/order';
import type { OrderStatus } from '@/types/orderStatus';
import type { OrderItem } from '@/types/orderItem';
import type { Domain } from '@/types/domain';
import type { EquipementCompany } from '@/types/equipementCompany';

interface FormData {
  login: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

interface AdminOrder extends Order {
  orderId: string;
}

interface AdminOrderStatus extends OrderStatus {
  orderStatusId: string;
  name?: string;
  code?: string;
}

interface AdminOrderItem extends OrderItem {
  orderId?: string;
  domainId?: string;
  equipementCompanyId?: string;
  startDate?: string;
  endDate?: string;
  quantity?: string;
}

export default defineComponent({
  name: 'UsersManagement',
  components: {
    DataTable,
    Column,
    Dialog,
    Button,
    InputText,
    Checkbox,
    Tag,
    Dropdown,
    AdminEmptyState,
    AdminSectionHeader,
    AdminTableToolbar,
  },
  data() {
    return {
      users: [] as User[],
      userSearch: '',
      userRoleFilter: 'all',
      isLoading: false,
      isSaving: false,
      dialogVisible: false,
      dialogMode: 'create' as 'create' | 'edit',
      selectedUserId: null as string | null,
      selectedOrdersUser: null as User | null,
      selectedUserOrders: [] as AdminOrder[],
      orderSearch: '',
      orderStatusFilter: 'all',
      ordersDialogVisible: false,
      ordersLoading: false,
      orderDialogVisible: false,
      selectedOrderId: null as string | null,
      isOrderSaving: false,
      allOrderStatuses: [] as AdminOrderStatus[],
      allOrderItems: [] as AdminOrderItem[],
      domainNameById: {} as Record<string, string>,
      equipmentNameById: {} as Record<string, string>,
      orderForm: {
        statusId: '',
      } as { statusId: string },
      formData: {
        login: '',
        email: '',
        password: '',
        isAdmin: false,
        isSuperAdmin: false,
      } as FormData,
      userRoleFilterOptions: [
        { label: 'Tous', value: 'all' },
        { label: 'Admins', value: 'admin' },
        { label: 'Super Admins', value: 'super-admin' },
        { label: 'Utilisateurs', value: 'standard' },
      ] as Array<{ label: string; value: string }>,
    };
  },
  methods: {
    resetUserTableFilters() {
      this.userSearch = '';
      this.userRoleFilter = 'all';
    },
    resetOrderTableFilters() {
      this.orderSearch = '';
      this.orderStatusFilter = 'all';
    },
    async loadUsers() {
      this.isLoading = true;
      try {
        this.users = await getUsers();
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les utilisateurs',
          life: 3000,
        });
      } finally {
        this.isLoading = false;
      }
    },
    openCreateDialog() {
      this.dialogMode = 'create';
      this.resetForm();
      this.dialogVisible = true;
    },
    editUser(user: User) {
      this.dialogMode = 'edit';
      this.selectedUserId = (user as any).userId as string;
      this.formData = {
        login: user.login || '',
        email: user.email || '',
        isAdmin: user.isAdmin || false,
        isSuperAdmin: user.isSuperAdmin || false,
      };
      this.dialogVisible = true;
    },
    async saveUser() {
      const authStore = useAuthStore();
      if (!authStore.user?.userId) return;

      this.isSaving = true;
      try {
        if (this.dialogMode === 'create') {
          await createUser({
            login: this.formData.login,
            email: this.formData.email,
            password: this.formData.password || '',
            isAdmin: this.formData.isAdmin,
            isSuperAdmin: this.formData.isSuperAdmin,
            userCreateId: String(authStore.user.userId),
          });
          this.$toast.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Utilisateur créé avec succès',
            life: 3000,
          });
        } else if (this.selectedUserId) {
          await updateUser(this.selectedUserId, {
            login: this.formData.login,
            email: this.formData.email,
            isAdmin: this.formData.isAdmin,
            isSuperAdmin: this.formData.isSuperAdmin,
            userUpdateId: String(authStore.user.userId),
          });
          this.$toast.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Utilisateur modifié avec succès',
            life: 3000,
          });
        }
        this.dialogVisible = false;
        await this.loadUsers();
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.response?.data?.message || 'Une erreur s\'est produite',
          life: 3000,
        });
      } finally {
        this.isSaving = false;
      }
    },
    async deleteUser(userId: string) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

      try {
        await deleteUser(userId);
        this.$toast.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Utilisateur supprimé avec succès',
          life: 3000,
        });
        await this.loadUsers();
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.response?.data?.message || 'Impossible de supprimer l\'utilisateur',
          life: 3000,
        });
      }
    },
    async openUserOrdersDialog(user: User) {
      this.selectedOrdersUser = user;
      this.ordersDialogVisible = true;
      await this.loadOrdersForSelectedUser();
    },
    async loadOrdersForSelectedUser() {
      if (!this.selectedOrdersUser) {
        this.selectedUserOrders = [];
        return;
      }

      this.ordersLoading = true;
      try {
        const userId = String((this.selectedOrdersUser as any).userId || '');
        const [allOrders, orderStatuses, orderItems, domains, equipements] = await Promise.all([
          getOrders(),
          getOrderStatuses(),
          getOrderItems(),
          getDomains(),
          getEquipementsCompany(),
        ]);

        this.allOrderStatuses = orderStatuses as AdminOrderStatus[];
        this.allOrderItems = orderItems as AdminOrderItem[];
        this.domainNameById = this.buildDomainMap(domains as Domain[]);
        this.equipmentNameById = this.buildEquipmentMap(equipements as EquipementCompany[]);

        this.selectedUserOrders = allOrders.filter(
          (order) => String(order.userId || '') === userId,
        ) as AdminOrder[];
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les commandes de cet utilisateur',
          life: 3000,
        });
      } finally {
        this.ordersLoading = false;
      }
    },
    editOrder(order: AdminOrder) {
      this.selectedOrderId = order.orderId;
      this.orderForm = {
        statusId: String(order.statusId || ''),
      };
      this.orderDialogVisible = true;
    },
    async saveOrder() {
      if (!this.selectedOrderId) return;

      const authStore = useAuthStore();
      this.isOrderSaving = true;
      try {
        await updateOrderService(this.selectedOrderId, {
          statusId: this.orderForm.statusId,
          userUpdateId: authStore.user?.userId
            ? String(authStore.user.userId)
            : undefined,
        } as Partial<Order>);

        this.$toast.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Commande modifiée avec succès',
          life: 3000,
        });

        this.orderDialogVisible = false;
        await this.loadOrdersForSelectedUser();
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.response?.data?.message || 'Impossible de modifier la commande',
          life: 3000,
        });
      } finally {
        this.isOrderSaving = false;
      }
    },
    async deleteOrderAction(orderId: string) {
      if (!orderId) return;
      if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) return;

      try {
        await deleteOrderService(orderId);
        this.$toast.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Commande supprimée avec succès',
          life: 3000,
        });
        await this.loadOrdersForSelectedUser();
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.response?.data?.message || 'Impossible de supprimer la commande',
          life: 3000,
        });
      }
    },
    resetOrderForm() {
      this.selectedOrderId = null;
      this.orderForm = {
        statusId: '',
      };
    },
    resetOrdersState() {
      this.selectedOrdersUser = null;
      this.selectedUserOrders = [];
      this.ordersLoading = false;
      this.resetOrderTableFilters();
      this.resetOrderForm();
    },
    buildDomainMap(domains: Domain[]): Record<string, string> {
      const map: Record<string, string> = {};
      for (const domain of domains) {
        const domainId = String((domain as any).domainId || '');
        if (domainId) {
          map[domainId] = domain.name || `Domaine #${domainId}`;
        }
      }
      return map;
    },
    buildEquipmentMap(equipements: EquipementCompany[]): Record<string, string> {
      const map: Record<string, string> = {};
      for (const equipment of equipements) {
        const equipmentId = String((equipment as any).equipementCompanyId || '');
        if (equipmentId) {
          map[equipmentId] = equipment.displayName || `Equipement #${equipmentId}`;
        }
      }
      return map;
    },
    getOrderStatusLabel(statusId?: string): string {
      if (!statusId) return 'Statut inconnu';
      const status = this.allOrderStatuses.find(
        (item) => String(item.orderStatusId) === String(statusId),
      );
      if (!status) return `Statut #${statusId}`;
      return status.name || status.code || `Statut #${statusId}`;
    },
    getOrderReservationsList(orderId?: string): string[] {
      if (!orderId) return ['-'];

      const items = this.allOrderItems.filter(
        (item) => String(item.orderId || '') === String(orderId),
      );

      if (items.length === 0) {
        return ['Aucun lieu ou equipement reserve'];
      }

      return items
        .map((item) => {
          const domainLabel = item.domainId
            ? this.domainNameById[String(item.domainId)]
            : '';
          const equipmentLabel = item.equipementCompanyId
            ? this.equipmentNameById[String(item.equipementCompanyId)]
            : '';
          const productLabel = domainLabel || equipmentLabel || 'Produit inconnu';
          const start = item.startDate || '?';
          const end = item.endDate || '?';
          const quantity = item.quantity ? ` x${item.quantity}` : '';
          return `${productLabel}${quantity} (${start} -> ${end})`;
        });
    },
    resetForm() {
      this.selectedUserId = null;
      this.formData = {
        login: '',
        email: '',
        password: '',
        isAdmin: false,
        isSuperAdmin: false,
      };
    },
  },
  computed: {
    filteredUsers(): User[] {
      const search = this.userSearch.trim().toLowerCase();

      return this.users.filter((user) => {
        const matchesSearch =
          search.length === 0 ||
          String((user as any).userId || '').toLowerCase().includes(search) ||
          String(user.login || '').toLowerCase().includes(search) ||
          String(user.email || '').toLowerCase().includes(search);

        if (!matchesSearch) return false;

        if (this.userRoleFilter === 'admin') return !!user.isAdmin;
        if (this.userRoleFilter === 'super-admin') return !!user.isSuperAdmin;
        if (this.userRoleFilter === 'standard') return !user.isAdmin && !user.isSuperAdmin;

        return true;
      });
    },
    filteredUserOrders(): AdminOrder[] {
      const search = this.orderSearch.trim().toLowerCase();

      return this.selectedUserOrders.filter((order) => {
        const statusLabel = this.getOrderStatusLabel(order.statusId).toLowerCase();
        const reservations = this.getOrderReservationsList(order.orderId)
          .join(' ')
          .toLowerCase();

        const matchesSearch =
          search.length === 0 ||
          String(order.orderId || '').toLowerCase().includes(search) ||
          statusLabel.includes(search) ||
          reservations.includes(search);

        if (!matchesSearch) return false;

        if (this.orderStatusFilter !== 'all') {
          return String(order.statusId || '') === this.orderStatusFilter;
        }

        return true;
      });
    },
    orderStatusOptions(): Array<{ label: string; value: string }> {
      return this.allOrderStatuses.map((status) => ({
        label: status.name || status.code || `Statut #${status.orderStatusId}`,
        value: String(status.orderStatusId),
      }));
    },
    orderStatusFilterOptions(): Array<{ label: string; value: string }> {
      return [{ label: 'Tous', value: 'all' }, ...this.orderStatusOptions];
    },
  },
  mounted() {
    this.loadUsers();
  },
});
</script>

<style scoped>
:deep(.custom-datatable) {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f9fafb;
  font-weight: 600;
}

:deep(.p-inputtext) {
  width: 100%;
  border-radius: 0.375rem;
}

:deep(.p-checkbox) {
  margin-right: 0.5rem;
}
</style>
