"use client"

import * as React from "react"
import { useState } from "react"
import { Upload, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Checkbox } from "@/components/ui/Checkbox"

interface LeadFormProps {
  onSubmit?: (data: FormData) => void | Promise<void>
  className?: string
}

export function LeadForm({ onSubmit, className }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      await onSubmit?.(formData)
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "bg-white rounded-2xl border border-laas-gray-200 p-6 shadow-laas-lg space-y-6",
        className
      )}
    >
      {/* Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="prescription">Prescrição / Foto</Label>
        <div className="relative">
          <input
            id="prescription"
            name="prescription"
            type="file"
            accept="image/*,application/pdf"
            className="sr-only"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="prescription"
            className={cn(
              "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
              previewImage
                ? "border-laas-blue bg-laas-blue/5"
                : "border-laas-gray-300 hover:border-laas-blue hover:bg-laas-gray-50"
            )}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="h-full object-contain rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-center p-4">
                <Upload className="w-8 h-8 text-laas-gray-400" />
                <span className="text-sm text-laas-gray-600">
                  Clique para enviar sua prescrição
                </span>
                <span className="text-xs text-laas-gray-400">
                  PDF, JPG ou PNG
                </span>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Nome */}
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          name="name"
          placeholder="Seu nome"
          required
        />
      </div>

      {/* WhatsApp */}
      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          placeholder="(00) 00000-0000"
          required
        />
      </div>

      {/* E-mail */}
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          required
        />
      </div>

      {/* LGPD Consent */}
      <div className="flex items-start gap-3">
        <Checkbox id="lgpd" name="lgpd" required className="mt-1" />
        <label
          htmlFor="lgpd"
          className="text-sm text-laas-gray-600 leading-relaxed cursor-pointer"
        >
          Concordo com a{" "}
          <a
            href="/politica-privacidade"
            className="text-laas-blue hover:underline font-medium"
            target="_blank"
          >
            Política de Privacidade
          </a>{" "}
          e autorizo o uso dos meus dados conforme a LGPD
        </label>
      </div>

      {/* Additional Info */}
      <div className="bg-laas-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-laas-gray-600">Trial disponível</span>
          <span className="font-semibold text-laas-blue">Grátis</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-laas-gray-600">CRM-MG</span>
          <span className="font-semibold text-laas-blue">69.870</span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Calculando...
          </>
        ) : (
          "Calcule sua economia"
        )}
      </Button>

      {/* Economy Link */}
      <a
        href="#economia"
        className="block text-center text-sm text-laas-blue hover:underline font-medium"
      >
        Ver simulação de economia →
      </a>
    </form>
  )
}
