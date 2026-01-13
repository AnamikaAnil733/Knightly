
interface SectionHeaderProps {
  title: string
  description?: string
}
export const SectionHeader = ({ title, description }: SectionHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center">
        <div className="w-1.5 h-6 bg-[#6B2EFF] rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {description && <p className="text-[#C9CAD9] mt-2 ml-4">{description}</p>}
    </div>
  )
}
