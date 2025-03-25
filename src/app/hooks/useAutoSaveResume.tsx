import useDebounce from "@/app/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { saveResume } from "../../../actions/actions";
import { Button } from "@/components/ui/button";
import { fileReplacer } from "@/lib/utils";

const useAutoSaveResume = (resumeData: ResumeValues) => {
  const searchParams = useSearchParams();
  const debouncedResumeData = useDebounce(resumeData, 1500);
  const [lastSavedData, setLastSavedData] = useState(
    structuredClone(resumeData)
  );
  const [resumeId, setResumeId] = useState(resumeData?.id);
  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [debouncedResumeData]);
  useEffect(() => {
    async function save() {
      try {
        setIsSaving(true);
        setIsError(false);
        const newData = structuredClone(debouncedResumeData);
        const updatedResume = await saveResume({
          ...newData,
          ...(lastSavedData.photo && newData.photo &&
            JSON.stringify(lastSavedData.photo, fileReplacer) ===
            JSON.stringify(newData.photo, fileReplacer) && {
            photo: undefined,
          }),
          

          id: resumeId,
        });
        setResumeId(updatedResume.id);
        setLastSavedData(newData);

        if (searchParams.get("resumeId") !== updatedResume.id) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("resumeId", updatedResume.id);
          window.history.replaceState(
            null,
            "",
            `?${newSearchParams.toString()}`
          );
        }
      } catch (error: any) {
        setIsError(true);
        console.error("Save failed: ", error.message);
        toast.error("Failed to save resume", {
          duration: 10000,
          description: (
            <div className="space-y-3">
              <p>Could not save changes</p>
              <Button variant={"secondary"} onClick={() => save()}>
                Retry
              </Button>
            </div>
          ),
        });
      } finally {
        setIsSaving(false);
      }

      setLastSavedData(structuredClone(debouncedResumeData));
    }
    const hasUnsavedChanges =
      JSON.stringify(lastSavedData, fileReplacer) !==
      JSON.stringify(debouncedResumeData, fileReplacer);

    if (hasUnsavedChanges && debouncedResumeData && !isSaving && !isError)
      save();
  }, [
    debouncedResumeData,
    isSaving,
    lastSavedData,
    isError,
    resumeId,
    searchParams,
  ]);
  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(lastSavedData, fileReplacer) !== JSON.stringify(resumeData, fileReplacer),
  };
};

export default useAutoSaveResume;
