import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomerPortalLayout } from "@/components/customer/layout/CustomerPortalLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  ChevronRight, 
  FileUp, 
  Loader2, 
  Upload, 
  CheckCircle, 
  Clock,
  AlertCircle,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Form schema using Zod
const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }).optional(),
  company: z.string().optional(),
});

const inquiryDetailsSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  priority: z.enum(["low", "medium", "high"]),
  category: z.string().min(1, { message: "Please select a category" }),
});

// File schema with validation for type and size
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg", 
  "image/png", 
  "image/webp", 
  "application/pdf", 
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const fileSchema = z.object({
  files: z
    .array(
      z.instanceof(File)
        .refine(file => file.size <= MAX_FILE_SIZE, {
          message: `File size must be less than 5MB`,
        })
        .refine(file => ACCEPTED_FILE_TYPES.includes(file.type), {
          message: `File must be an image (JPEG, PNG, WebP), PDF, or document (DOC, DOCX)`,
        })
    )
    .optional(),
});

// Combined schema
const formSchema = z.object({
  contact: contactSchema,
  details: inquiryDetailsSchema,
  attachments: fileSchema,
});

// Form state type
type FormValues = z.infer<typeof formSchema>;

// Steps of the form
const steps = [
  { id: "contact", label: "Contact Information" },
  { id: "details", label: "Inquiry Details" },
  { id: "attachments", label: "Attachments" },
  { id: "review", label: "Review & Submit" },
];

// File interface for uploads
interface FileWithPreview extends File {
  preview: string;
  id: string;
}

const InquirySubmission = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<FileWithPreview[]>([]);
  const [formProgress, setFormProgress] = useState(() => {
    // Try to load saved progress from localStorage
    const savedProgress = localStorage.getItem("inquiry_form_progress");
    return savedProgress ? JSON.parse(savedProgress) : 0;
  });
  const [formData, setFormData] = useState<Partial<FormValues>>(() => {
    // Try to load saved form data from localStorage
    const savedData = localStorage.getItem("inquiry_form_data");
    return savedData ? JSON.parse(savedData) : {
      contact: {
        name: profile?.name || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        company: "",
      },
      details: {
        title: "",
        description: "",
        priority: "medium",
        category: "",
      },
      attachments: {
        files: [],
      },
    };
  });

  // React Hook Form setup
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formData as FormValues,
    mode: "onChange",
  });

  // Update form data when steps change
  const handleStepChange = (direction: "next" | "prev") => {
    // Get current form data
    const currentValues = methods.getValues();
    setFormData(currentValues);
    
    // Save to localStorage
    localStorage.setItem("inquiry_form_data", JSON.stringify(currentValues));
    
    // Update current step
    if (direction === "next") {
      setCurrentStep(prev => {
        const newStep = prev + 1;
        setFormProgress(newStep);
        localStorage.setItem("inquiry_form_progress", JSON.stringify(newStep));
        return newStep;
      });
    } else {
      setCurrentStep(prev => {
        const newStep = prev - 1;
        setFormProgress(newStep);
        localStorage.setItem("inquiry_form_progress", JSON.stringify(newStep));
        return newStep;
      });
    }
  };

  // Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Create preview URLs for files
    const filesWithPreviews = files.map(file => {
      const fileWithPreview = file as FileWithPreview;
      
      // Create preview URLs for images, or placeholder for other files
      if (file.type.startsWith("image/")) {
        fileWithPreview.preview = URL.createObjectURL(file);
      } else if (file.type === "application/pdf") {
        fileWithPreview.preview = "/assets/icons/pdf.svg";
      } else {
        fileWithPreview.preview = "/assets/icons/document.svg";
      }
      
      // Add unique ID for tracking
      fileWithPreview.id = crypto.randomUUID();
      
      return fileWithPreview;
    });
    
    setUploadFiles(prev => [...prev, ...filesWithPreviews]);
    methods.setValue("attachments.files", [...uploadFiles, ...filesWithPreviews]);
  };

  // Remove a file from the uploads
  const removeFile = (id: string) => {
    setUploadFiles(prev => {
      const filtered = prev.filter(file => file.id !== id);
      methods.setValue("attachments.files", filtered);
      return filtered;
    });
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Submit the form to Supabase
  const handleSubmit = async (data: FormValues) => {
    if (!profile?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit an inquiry",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 1. Create the inquiry
      const { data: inquiry, error: inquiryError } = await supabase
        .from("inquiries")
        .insert({
          customer_id: profile.id,
          title: data.details.title,
          description: data.details.description,
          status: "new",
          priority: data.details.priority,
          category: data.details.category,
          contact_name: data.contact.name,
          contact_email: data.contact.email,
          contact_phone: data.contact.phone || null,
          contact_company: data.contact.company || null,
        })
        .select("id")
        .single();
        
      if (inquiryError) throw inquiryError;
      
      // 2. Upload attachment files if present
      if (uploadFiles.length > 0) {
        const uploadPromises = uploadFiles.map(async (file) => {
          const filePath = `inquiries/${inquiry.id}/${file.name}`;
          
          const { error: uploadError } = await supabase.storage
            .from("attachments")
            .upload(filePath, file);
            
          if (uploadError) throw uploadError;
          
          // 3. Create attachment record
          const { error: attachmentError } = await supabase
            .from("attachments")
            .insert({
              inquiry_id: inquiry.id,
              file_path: filePath,
              file_name: file.name,
              file_type: file.type,
              file_size: file.size,
            });
            
          if (attachmentError) throw attachmentError;
          
          return filePath;
        });
        
        await Promise.all(uploadPromises);
      }
      
      // Clear saved form data
      localStorage.removeItem("inquiry_form_data");
      localStorage.removeItem("inquiry_form_progress");
      
      // Show success message
      toast({
        title: "Inquiry submitted successfully",
        description: "Your inquiry has been submitted and will be reviewed shortly",
      });
      
      // Redirect to inquiry details page
      navigate(`/customer/enquiries/${inquiry.id}`);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast({
        title: "Error submitting inquiry",
        description: "There was an error submitting your inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear preview URLs on unmount
  useEffect(() => {
    return () => {
      uploadFiles.forEach(file => {
        if (file.preview && file.preview.startsWith("blob:")) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [uploadFiles]);

  return (
    <CustomerPortalLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Submit New Inquiry</h1>
          <p className="text-muted-foreground mt-1">
            Fill out the form below to submit a new inquiry to our team
          </p>
        </div>
        
        {/* Step Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className="flex flex-col items-center"
              >
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                    index === currentStep 
                      ? "bg-primary text-primary-foreground" 
                      : index < currentStep 
                        ? "bg-primary/80 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span 
                  className={cn(
                    "text-xs mt-1 font-medium",
                    index === currentStep 
                      ? "text-primary" 
                      : index < currentStep 
                        ? "text-primary/80"
                        : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
        </div>
        
        <Card className="max-w-3xl mx-auto">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <CardHeader>
                <CardTitle>{steps[currentStep].label}</CardTitle>
                <CardDescription>
                  {currentStep === 0 && "Provide your contact information"}
                  {currentStep === 1 && "Tell us about your inquiry"}
                  {currentStep === 2 && "Attach any relevant files (optional)"}
                  {currentStep === 3 && "Review your information before submitting"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Contact Information Step */}
                {currentStep === 0 && <ContactForm />}
                
                {/* Inquiry Details Step */}
                {currentStep === 1 && <InquiryDetailsForm />}
                
                {/* Attachments Step */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div 
                      className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Drag and drop files here or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Accepted formats: JPEG, PNG, WebP, PDF, DOC, DOCX (Max 5MB per file)
                      </p>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </div>
                    
                    {/* File list */}
                    {uploadFiles.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <h3 className="text-sm font-medium">Uploaded Files ({uploadFiles.length})</h3>
                        {uploadFiles.map(file => (
                          <div 
                            key={file.id} 
                            className="flex items-center justify-between p-2 border rounded-md"
                          >
                            <div className="flex items-center space-x-2">
                              {file.type.startsWith("image/") ? (
                                <img 
                                  src={file.preview} 
                                  alt={file.name} 
                                  className="h-10 w-10 object-cover rounded"
                                />
                              ) : (
                                <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                                  <span className="text-xs font-medium">
                                    {file.type.includes("pdf") ? "PDF" : "DOC"}
                                  </span>
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="text-sm font-medium truncate max-w-[200px]">
                                  {file.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatFileSize(file.size)}
                                </span>
                              </div>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(file.id);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Review Step */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Contact Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name:</span>
                          <p>{methods.getValues().contact.name}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <p>{methods.getValues().contact.email}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone:</span>
                          <p>{methods.getValues().contact.phone || "Not provided"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Company:</span>
                          <p>{methods.getValues().contact.company || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Inquiry Details</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Title:</span>
                          <p className="font-medium">{methods.getValues().details.title}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Category:</span>
                          <p>{methods.getValues().details.category}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Priority:</span>
                          <p>
                            <span 
                              className={cn(
                                "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                                methods.getValues().details.priority === "high" 
                                  ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100" 
                                  : methods.getValues().details.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                                    : "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              )}
                            >
                              {methods.getValues().details.priority.charAt(0).toUpperCase() + 
                                methods.getValues().details.priority.slice(1)}
                            </span>
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Description:</span>
                          <p className="whitespace-pre-wrap mt-1">
                            {methods.getValues().details.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {uploadFiles.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-medium mb-2">Attachments ({uploadFiles.length})</h3>
                          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                            {uploadFiles.map(file => (
                              <div 
                                key={file.id} 
                                className="border rounded-md p-2 flex flex-col items-center text-center"
                              >
                                {file.type.startsWith("image/") ? (
                                  <img 
                                    src={file.preview} 
                                    alt={file.name} 
                                    className="h-16 w-16 object-cover rounded mb-1"
                                  />
                                ) : (
                                  <div className="h-16 w-16 bg-muted rounded flex items-center justify-center mb-1">
                                    <span className="text-xs font-medium">
                                      {file.type.includes("pdf") ? "PDF" : "DOC"}
                                    </span>
                                  </div>
                                )}
                                <span className="text-xs truncate w-full">
                                  {file.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between">
                {currentStep > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleStepChange("prev")}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/customer/dashboard")}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={async () => {
                      let isValid = false;
                      
                      if (currentStep === 0) {
                        isValid = await methods.trigger("contact");
                      } else if (currentStep === 1) {
                        isValid = await methods.trigger("details");
                      } else if (currentStep === 2) {
                        isValid = true; // Attachments are optional
                      }
                      
                      if (isValid) {
                        handleStepChange("next");
                      }
                    }}
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Inquiry
                        <Upload className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </form>
          </FormProvider>
        </Card>
      </div>
    </CustomerPortalLayout>
  );
};

// Contact form component (Step 1)
const ContactForm = () => {
  const { control, formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="contact.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="contact.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input placeholder="johndoe@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="contact.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="+1 (555) 123-4567" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="contact.company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Acme Inc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

// Inquiry Details form component (Step 2)
const InquiryDetailsForm = () => {
  const { control } = useFormContext();
  
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="details.title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Inquiry Title</FormLabel>
            <FormControl>
              <Input placeholder="Brief title of your inquiry" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="details.category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="support">Technical Support</SelectItem>
                <SelectItem value="billing">Billing & Payments</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="details.priority"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Priority</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Select the priority level for your inquiry
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="details.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Please provide a detailed description of your inquiry" 
                className="min-h-32" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default InquirySubmission; 