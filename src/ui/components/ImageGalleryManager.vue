<template>
  <div class="image-gallery-manager">
    <div class="flex items-center justify-between mb-4">
      <label class="block font-medium">Images ({{ (imageUrls?.length ?? 0) }}/5)</label>
      <span v-if="(imageUrls?.length ?? 0) >= 5" class="text-xs text-orange-600 font-medium">
        Limite atteinte
      </span>
    </div>

    <div class="space-y-4">
      <!-- Gallery Grid -->
      <div v-if="imageUrls && imageUrls.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div
          v-for="(url, index) in imageUrls"
          :key="`image-${index}`"
          class="relative group"
        >
          <img
            :src="url"
            :alt="`Image ${index + 1}`"
            class="w-full h-32 rounded-lg object-cover border-2 border-gray-200 hover:border-blue-400 transition"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg transition flex items-center justify-center gap-2">
            <Button
              icon="pi pi-trash"
              rounded
              severity="danger"
              :text="true"
              size="small"
              @click="handleRemoveImage(index)"
              class="opacity-0 group-hover:opacity-100 transition"
            />
            <div
              v-if="imageUrls.length > 1"
              class="flex gap-1 opacity-0 group-hover:opacity-100 transition"
            >
              <Button
                v-if="index > 0"
                icon="pi pi-arrow-left"
                rounded
                severity="secondary"
                :text="true"
                size="small"
                @click="moveImage(index, -1)"
              />
              <Button
                v-if="index < imageUrls.length - 1"
                icon="pi pi-arrow-right"
                rounded
                severity="secondary"
                :text="true"
                size="small"
                @click="moveImage(index, 1)"
              />
            </div>
          </div>
          <div class="absolute top-2 left-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {{ index + 1 }}
          </div>
        </div>

        <!-- Upload Placeholder -->
        <div
          v-if="imageUrls.length < 5"
          class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer min-h-32"
          @click="triggerFileInput"
        >
          <input
            ref="selectFile"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            class="hidden"
            @change="onImageSelected"
          />
          <div class="text-center">
            <i class="pi pi-cloud-upload text-2xl text-gray-400 mb-2 block" />
            <p class="text-sm text-gray-600">Ajouter une image</p>
            <p class="text-xs text-gray-500">PNG, JPEG ou WebP</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer"
        @click="triggerFileInput"
      >
        <input
          ref="selectFile"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          class="hidden"
          @change="onImageSelected"
        />
        <i class="pi pi-image text-4xl text-gray-400 mb-3" />
        <p class="text-base font-medium text-gray-700 mb-1">Aucune image</p>
        <p class="text-sm text-gray-600 mb-3">Cliquez pour ajouter jusqu'à 5 images</p>
        <p class="text-xs text-gray-500">PNG, JPEG ou WebP • Max 5MB chacune</p>
      </div>

      <!-- Upload Button -->
      <div v-if="selectedFile" class="flex gap-2">
        <Button
          label="Téléverser"
          icon="pi pi-upload"
          :loading="isUploading"
          :disabled="!selectedFile"
          @click="uploadImage"
        />
        <Button
          label="Annuler"
          severity="secondary"
          @click="cancelUpload"
        />
      </div>

      <!-- Error Message -->
      <Message
        v-if="errorMessage"
        severity="error"
        :text="errorMessage"
        class="w-full"
      />

      <!-- Info Message -->
      <Message
        v-if="imageUrls && imageUrls.length > 0"
        severity="info"
        text="La première image est utilisée comme photo principale"
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { UI } from '@/constants/const'

interface Props {
  imageUrls?: string[]
  isLoading?: boolean
  onUpload?: (file: File) => Promise<void>
  onRemove?: (index: number) => Promise<void>
  onReorder?: (images: string[]) => Promise<void>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  upload: [file: File]
  remove: [index: number]
  reorder: [images: string[]]
  'update:imageUrls': [value: string[]]
}>()

const selectFile = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const isUploading = ref(false)
const errorMessage = ref('')
const imageUrls = ref<string[]>(props.imageUrls ?? [])

watch(() => props.imageUrls, (newVal) => {
  imageUrls.value = newVal ?? []
})

const triggerFileInput = () => {
  if ((imageUrls.value?.length ?? 0) < 5) {
    selectFile.value?.click()
  }
}

const onImageSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  errorMessage.value = ''

  if (!file) {
    selectedFile.value = null
    return
  }

  const error = validateImage(file)
  if (error) {
    errorMessage.value = error
    selectedFile.value = null
    if (selectFile.value) selectFile.value.value = ''
    return
  }

  selectedFile.value = file
}

const validateImage = (file: File): string | null => {
  if (!UI.ALLOWED_IMAGE_TYPES.includes(file.type as (typeof UI.ALLOWED_IMAGE_TYPES)[number])) {
    return 'Format invalide (PNG, JPEG ou WebP)'
  }
  if (file.size > UI.MAX_UPLOAD_SIZE_BYTES) {
    return `Fichier trop volumineux (max ${(UI.MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)).toFixed(0)}MB)`
  }
  return null
}

const uploadImage = async () => {
  if (!selectedFile.value) return

  isUploading.value = true
  errorMessage.value = ''

  try {
    if (props.onUpload) {
      await props.onUpload(selectedFile.value)
    } else {
      emit('upload', selectedFile.value)
    }
    selectedFile.value = null
    if (selectFile.value) selectFile.value.value = ''
  } catch (error) {
    errorMessage.value = 'Erreur lors du téléversement'
    console.error(error)
  } finally {
    isUploading.value = false
  }
}

const cancelUpload = () => {
  selectedFile.value = null
  if (selectFile.value) selectFile.value.value = ''
  errorMessage.value = ''
}

const handleRemoveImage = async (index: number) => {
  isUploading.value = true
  errorMessage.value = ''

  try {
    if (props.onRemove) {
      await props.onRemove(index)
    } else {
      emit('remove', index)
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la suppression'
    console.error(error)
  } finally {
    isUploading.value = false
  }
}

const moveImage = async (index: number, direction: number) => {
  const newImages = [...(imageUrls.value ?? [])]
  const newIndex = index + direction

  if (newIndex < 0 || newIndex >= newImages.length) return

  const temp: string | undefined = newImages[index]
  newImages[index] = newImages[newIndex] ?? ''
  newImages[newIndex] = temp ?? ''

  try {
    if (props.onReorder) {
      await props.onReorder(newImages)
    } else {
      emit('reorder', newImages)
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la réorganisation'
    console.error(error)
  }
}
</script>

<style scoped lang="scss">
.image-gallery-manager {
  width: 100%;
}
</style>
