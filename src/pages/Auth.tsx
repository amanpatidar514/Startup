import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Mail, Lock, User, RefreshCw, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface FormErrors {
	email?: string;
	password?: string;
	confirmPassword?: string;
	fullName?: string;
	otpCode?: string;
	newPassword?: string;
	confirmNewPassword?: string;
}

interface FormData {
	email: string;
	password: string;
	confirmPassword: string;
	fullName: string;
}

const Auth = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [activeTab, setActiveTab] = useState("signin");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
	const [otpMode, setOtpMode] = useState(false);
	const [passwordCreationMode, setPasswordCreationMode] = useState(false);
	const [otpCode, setOtpCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [shakeForm, setShakeForm] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});

	const [formData, setFormData] = useState<FormData>({
		email: "",
		password: "",
		confirmPassword: "",
		fullName: "",
	});

	// Clear errors when switching tabs
	useEffect(() => {
		setErrors({});
		setTouched({});
	}, [activeTab, forgotPasswordMode, otpMode, passwordCreationMode]);

	// Handle OAuth callback and create user profile
	useEffect(() => {
		const handleOAuthCallback = async () => {
			const { data: { session } } = await supabase.auth.getSession();
			
			if (session?.user) {
				// Check if user profile exists
				const { data: existingProfile } = await supabase
					.from('users')
					.select('*')
					.eq('id', session.user.id)
					.single();

				if (!existingProfile) {
					// Get user details from Google metadata
					const googleName = session.user.user_metadata?.full_name || 
									 session.user.user_metadata?.name || 
									 session.user.user_metadata?.user_name ||
									 'Google User';
					
					// Create user profile for Google users
					try {
						const { error: profileError } = await supabase
							.from('users')
							.insert({
								id: session.user.id,
								email: session.user.email,
								full_name: googleName,
								created_at: new Date().toISOString(),
								updated_at: new Date().toISOString()
							});

						if (profileError) {
							console.error('Error creating Google user profile:', profileError);
						} else {
							// Update the user's metadata in Supabase auth
							const { error: updateError } = await supabase.auth.updateUser({
								data: {
									full_name: googleName,
									name: googleName
								}
							});

							if (updateError) {
								console.error('Error updating user metadata:', updateError);
							}

							toast({
								title: "Welcome to AdWhey!",
								description: "Your account has been created successfully.",
							});
						}
					} catch (error) {
						console.error('Error creating Google user profile:', error);
					}
				} else {
					// If profile exists, ensure metadata is up to date
					const googleName = session.user.user_metadata?.full_name || 
									 session.user.user_metadata?.name || 
									 session.user.user_metadata?.user_name;
					
					if (googleName && existingProfile.full_name !== googleName) {
						// Update both the users table and auth metadata
						await supabase
							.from('users')
							.update({ 
								full_name: googleName,
								updated_at: new Date().toISOString()
							})
							.eq('id', session.user.id);

						await supabase.auth.updateUser({
							data: {
								full_name: googleName,
								name: googleName
							}
						});
					}
				}
			}
		};

		handleOAuthCallback();
	}, []);

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		
		// Mark field as touched
		setTouched(prev => ({ ...prev, [field]: true }));
		
		// Clear error for this field when user starts typing
		if (errors[field as keyof FormErrors]) {
			setErrors(prev => ({ ...prev, [field]: undefined }));
		}
	};

	const clearForm = () => {
		console.log("Clearing form..."); // Debug log
		setFormData({
			email: "",
			password: "",
			confirmPassword: "",
			fullName: "",
		});
		setErrors({});
		setTouched({});
		// Also reset password visibility states
		setShowPassword(false);
		setShowConfirmPassword(false);
	};

	const triggerShake = () => {
		setShakeForm(true);
		setTimeout(() => setShakeForm(false), 500);
	};



	// Validation functions
	const validateEmail = (email: string): string | undefined => {
		if (!email) return "Email is required";
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) return "Please enter a valid email address";
		return undefined;
	};

	// Check if email is valid format
	const isEmailValid = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email.trim());
	};

	const validatePassword = (password: string, isSignUp: boolean = false): string | undefined => {
		if (!password) return "Password is required";
		if (password.length < 8) return "Password must be at least 8 characters long";
		return undefined;
	};

	// Check if password meets minimum length requirement
	const isPasswordValid = (password: string): boolean => {
		return password.length >= 8;
	};

	const validateFullName = (name: string): string | undefined => {
		if (!name) return "Full name is required";
		if (name.trim().length < 2) return "Full name must be at least 2 characters long";
		if (name.trim().length > 50) return "Full name must be less than 50 characters";
		return undefined;
	};

	// Check if full name has at least first name and surname (2 words)
	const isFullNameValid = (name: string): boolean => {
		const trimmedName = name.trim();
		if (!trimmedName) return false;
		const nameParts = trimmedName.split(' ').filter(part => part.length > 0);
		return nameParts.length >= 2;
	};



	const validateSignUpForm = (): boolean => {
		const newErrors: FormErrors = {};
		
		newErrors.fullName = validateFullName(formData.fullName);
		newErrors.email = validateEmail(formData.email);
		newErrors.password = validatePassword(formData.password, true);
		newErrors.confirmPassword = formData.password !== formData.confirmPassword ? "Passwords do not match" : undefined;
		
		setErrors(newErrors);
		return !Object.values(newErrors).some(error => error);
	};

	const validateSignInForm = (): boolean => {
		const newErrors: FormErrors = {};
		
		newErrors.email = validateEmail(formData.email);
		newErrors.password = validatePassword(formData.password);
		
		setErrors(newErrors);
		return !Object.values(newErrors).some(error => error);
	};

	const validateForgotPasswordForm = (): boolean => {
		const newErrors: FormErrors = {};
		newErrors.email = validateEmail(formData.email);
		setErrors(newErrors);
		return !Object.values(newErrors).some(error => error);
	};



	const handleGoogleSignIn = async () => {
		setLoading(true);
		
		try {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${window.location.origin}`,
					queryParams: {
						access_type: 'offline',
						prompt: 'consent',
					},
				},
			});

			if (error) {
				toast({
					variant: "destructive",
					title: "Google Sign In Failed",
					description: error.message,
				});
				triggerShake();
			}
		} catch (error: any) {
			console.error("Google sign in error:", error);
			toast({
				variant: "destructive",
				title: "Google Sign In Error",
				description: "An unexpected error occurred. Please try again.",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateSignInForm()) {
			triggerShake();
			return;
		}

		setLoading(true);

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email: formData.email.trim(),
				password: formData.password,
			});

			if (error) {
				// Handle specific Supabase auth errors
				if (error.message.includes("Invalid login credentials")) {
					toast({
						variant: "destructive",
						title: "Sign In Failed",
						description: "Invalid email or password. Please check your credentials and try again.",
					});
					triggerShake();
				} else if (error.message.includes("Email not confirmed")) {
					toast({
						variant: "destructive",
						title: "Email Not Confirmed",
						description: "Please check your email and click the confirmation link before signing in.",
					});
				} else if (error.message.includes("Too many requests")) {
					toast({
						variant: "destructive",
						title: "Too Many Attempts",
						description: "Too many failed attempts. Please wait a moment before trying again.",
					});
				} else {
					toast({
						variant: "destructive",
						title: "Sign In Error",
						description: error.message,
					});
				}
				return;
			}

			toast({
				title: "Welcome Back!",
				description: "You have been signed in successfully.",
			});
			navigate('/');
		} catch (error: any) {
			console.error("Sign in error:", error);
			toast({
				variant: "destructive",
				title: "Sign In Error",
				description: "An unexpected error occurred. Please try again.",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateSignUpForm()) {
			triggerShake();
			return;
		}

		setLoading(true);

		try {
			const { data, error } = await supabase.auth.signUp({
				email: formData.email.trim(),
				password: formData.password,
				options: {
					data: {
						full_name: formData.fullName.trim(),
					},
				},
			});

			if (error) {
				console.log("Signup error:", error.message); // Debug log
				console.log("Error message includes check:", {
					"User already registered": error.message.includes("User already registered"),
					"already registered": error.message.includes("already registered"),
					"already exists": error.message.includes("already exists"),
					"already been registered": error.message.includes("already been registered")
				});
				
				// Handle specific error cases
				if (error.message.includes("User already registered") || 
					error.message.includes("already registered") ||
					error.message.includes("already exists") ||
					error.message.includes("already been registered")) {
					console.log("Showing toast for existing account...");
					toast({
						variant: "destructive",
						title: "Account Already Exists",
						description: "An account with this email already exists!",
					});
					triggerShake();
					// Add a small delay to ensure the message is visible before clearing
					setTimeout(() => {
						clearForm();
					}, 100);
				} else if (error.message.includes("Password should be at least")) {
					toast({
						variant: "destructive",
						title: "Weak Password",
						description: "Password is too weak. Please choose a stronger password.",
					});
					triggerShake();
				} else if (error.message.includes("Invalid email")) {
					toast({
						variant: "destructive",
						title: "Invalid Email",
						description: "Please enter a valid email address.",
					});
					triggerShake();
				} else {
					toast({
						variant: "destructive",
						title: "Sign Up Error",
						description: error.message,
					});
					triggerShake();
				}
				return;
			}

			// Check if signup was successful
			if (data.user) {
				// Save user profile to users table
				try {
					const { error: profileError } = await supabase
						.from('users')
						.insert({
							id: data.user.id,
							email: data.user.email,
							full_name: formData.fullName.trim(),
							created_at: new Date().toISOString(),
							updated_at: new Date().toISOString()
						});

					if (profileError) {
						console.error('Error saving profile:', profileError);
						// Don't show error to user as account was created successfully
					}
				} catch (error) {
					console.error('Error saving profile:', error);
					// Don't show error to user as account was created successfully
				}

				toast({
					title: "Account Created!",
					description: "Account created successfully! Welcome to AdWhey.",
				});
				navigate('/');
			} else {
				toast({
					title: "Account Created!",
					description: "Account created successfully! Please check your email to verify your account.",
				});
			}
		} catch (error: any) {
			console.error("Signup error:", error);
			// Check if it's a user already exists error in catch block too
			if (error.message && (
				error.message.includes("User already registered") || 
				error.message.includes("already registered") ||
				error.message.includes("already exists") ||
				error.message.includes("already been registered")
			)) {
				toast({
					variant: "destructive",
					title: "Account Already Exists",
					description: "An account with this email already exists!",
				});
				triggerShake();
				// Add a small delay to ensure the message is visible before clearing
				setTimeout(() => {
					clearForm();
				}, 100);
			} else {
				toast({
					variant: "destructive",
					title: "Sign Up Error",
					description: "An unexpected error occurred. Please try again.",
				});
			}
		} finally {
			setLoading(false);
		}
	};

	const handleForgotPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateForgotPasswordForm()) {
			triggerShake();
			return;
		}

		setLoading(true);

		try {
			// Call the Edge Function to send OTP via email
			const { data, error } = await supabase.functions.invoke('send-otp', {
				body: { email: formData.email.trim() }
			});

			if (error) {
				console.error("OTP sending error:", error);
				
				// Provide more specific error messages
				let errorMessage = "Failed to send verification code. Please try again.";
				
				if (error.message?.includes('non-2xx status code')) {
					errorMessage = "Server configuration error. Please contact administrator.";
				} else if (error.message?.includes('Failed to fetch')) {
					errorMessage = "Network error. Please check your connection and try again.";
				} else if (error.message) {
					errorMessage = error.message;
				}
				
				toast({
					variant: "destructive",
					title: "OTP Sending Failed",
					description: errorMessage,
				});
				return;
			}

			if (data.success) {
				// Store email for OTP verification
				localStorage.setItem('resetEmail', formData.email.trim());
				
				// Check if OTP is included in response (development mode)
				if (data.otp && data.warning) {
					toast({
						title: "OTP Generated Successfully! 🔐",
						description: `Verification code: ${data.otp} (Email service not configured)`,
					});
				} else {
					toast({
						title: "OTP Sent Successfully! 📧",
						description: "A 6-digit verification code has been sent to your email. Please check your inbox.",
					});
				}
				
				// Switch to OTP verification mode
				setOtpMode(true);
			} else {
				toast({
					variant: "destructive",
					title: "OTP Sending Failed",
					description: data.error || "Failed to send verification code. Please try again.",
				});
			}
		} catch (error: any) {
			console.error("Forgot password error:", error);
			
			let errorMessage = "An unexpected error occurred. Please try again.";
			
			if (error.message?.includes('non-2xx status code')) {
				errorMessage = "Server configuration error. Please contact administrator.";
			} else if (error.message?.includes('Failed to fetch')) {
				errorMessage = "Network error. Please check your connection and try again.";
			} else if (error.message) {
				errorMessage = error.message;
			}
			
			toast({
				variant: "destructive",
				title: "Password Reset Error",
				description: errorMessage,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleOtpVerification = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Clear previous errors
		setErrors({});
		
		// Validate all fields
		let hasErrors = false;
		const newErrors: FormErrors = {};
		
		if (!otpCode) {
			newErrors.otpCode = "Verification code is required";
			hasErrors = true;
		} else if (otpCode.length !== 6) {
			newErrors.otpCode = "Verification code must be 6 digits";
			hasErrors = true;
		}
		
		if (hasErrors) {
			setErrors(newErrors);
			triggerShake();
			return;
		}

		setLoading(true);

		try {
			// Get stored email from localStorage
			const storedEmail = localStorage.getItem('resetEmail');
			
			if (!storedEmail) {
				toast({
					variant: "destructive",
					title: "Session Expired",
					description: "Please request a new verification code.",
				});
				return;
			}

			// Verify email matches
			if (formData.email.trim() !== storedEmail) {
				toast({
					variant: "destructive",
					title: "Email Mismatch",
					description: "The email address doesn't match the one used for verification.",
				});
				return;
			}

			// OTP is verified successfully! Now show password creation form
			toast({
				title: "OTP Verified Successfully! ✅",
				description: "Please create your new password.",
			});
			
			// Switch to password creation mode
			setOtpMode(false);
			setPasswordCreationMode(true);
			setNewPassword("");
			setConfirmNewPassword("");
			
		} catch (error: any) {
			console.error("OTP verification error:", error);
			toast({
				variant: "destructive",
				title: "Verification Error",
				description: "An unexpected error occurred. Please try again.",
			});
		} finally {
			setLoading(false);
		}
	};

	const handlePasswordCreation = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Clear previous errors
		setErrors({});
		
		// Validate password fields
		let hasErrors = false;
		const newErrors: FormErrors = {};
		
		if (!newPassword) {
			newErrors.newPassword = "New password is required";
			hasErrors = true;
		} else if (newPassword.length < 8) {
			newErrors.newPassword = "Password must be at least 8 characters long";
			hasErrors = true;
		}
		
		if (!confirmNewPassword) {
			newErrors.confirmNewPassword = "Please confirm your new password";
			hasErrors = true;
		} else if (newPassword !== confirmNewPassword) {
			newErrors.confirmNewPassword = "Passwords do not match";
			hasErrors = true;
		}
		
		if (hasErrors) {
			setErrors(newErrors);
			triggerShake();
			return;
		}

		setLoading(true);

		try {
			// Get the stored email from localStorage
			const storedEmail = localStorage.getItem('resetEmail');
			
			if (!storedEmail) {
				toast({
					variant: "destructive",
					title: "Session Expired",
					description: "Please request a new verification code.",
				});
				return;
			}

			// Call the Edge Function to verify OTP and update password
			const { data, error } = await supabase.functions.invoke('verify-otp-update-password', {
				body: { 
					email: storedEmail,
					otp: otpCode,
					newPassword: newPassword
				}
			});

			if (error) {
				console.error("Password update error:", error);
				toast({
					variant: "destructive",
					title: "Password Update Failed",
					description: "Failed to update password. Please try again.",
				});
				return;
			}

			if (data.success) {
				// Success! Show success message
				toast({
					title: "Password Updated Successfully! 🎉",
					description: "Your password has been changed. You can now sign in with your new password.",
				});
				
				// Clear OTP data from localStorage
				localStorage.removeItem('resetEmail');
				
				// Reset all forms and go back to sign in
				setPasswordCreationMode(false);
				setForgotPasswordMode(false);
				setOtpCode("");
				setNewPassword("");
				setConfirmNewPassword("");
				setFormData(prev => ({ ...prev, email: "" }));
			} else {
				toast({
					variant: "destructive",
					title: "Password Update Failed",
					description: data.error || "Failed to update password. Please try again.",
				});
			}
			
		} catch (error: any) {
			console.error("Password creation error:", error);
			toast({
				variant: "destructive",
				title: "Password Creation Error",
				description: "An unexpected error occurred. Please try again.",
			});
		} finally {
			setLoading(false);
		}
	};

	const resetForgotPassword = () => {
		setForgotPasswordMode(false);
		setOtpMode(false);
		setPasswordCreationMode(false);
		setOtpCode("");
		setNewPassword("");
		setConfirmNewPassword("");
		setErrors({});
		setTouched({});
		setFormData(prev => ({ ...prev, email: "" }));
		
		// Clear any stored OTP data
		localStorage.removeItem('resetEmail');
	};

	const getFieldError = (field: keyof FormErrors): string | undefined => {
		return touched[field] ? errors[field] : undefined;
	};

	const getFieldClassName = (field: keyof FormErrors, baseClass: string): string => {
		const error = getFieldError(field);
		const hasValue = formData[field as keyof FormData];
		
		if (error) {
			return `${baseClass} border-red-500 focus:border-red-400 focus:ring-red-500/20`;
		} else if (hasValue && !error) {
			// Check specific validation for each field
			let isValid = false;
			
			switch (field) {
				case 'fullName':
					isValid = isFullNameValid(formData.fullName);
					break;
				case 'email':
					isValid = isEmailValid(formData.email);
					break;
				case 'password':
					// For both sign-in and sign-up, check if password meets minimum length requirement
					isValid = isPasswordValid(formData.password);
					break;
				case 'confirmPassword':
					isValid = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
					break;
				default:
					isValid = hasValue && !error;
			}
			
			if (isValid) {
				return `${baseClass} border-green-500/50 focus:border-green-400`;
			}
		}
		return baseClass;
	};

	return (
		<>
			<Helmet>
				<title>Sign In / Sign Up - AdWhey</title>
				<meta name="description" content="Sign in to your AdWhey account or create a new one to get started with our social media marketing services." />
			</Helmet>

			<div className="min-h-screen w-full relative bg-black">
				{/* Ocean Abyss Background with Top Glow */}
				<div
					className="absolute inset-0 z-0"
					style={{
						background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 70%), #000000",
					}}
				/>
				
				<Navbar />
				
				<main className="container flex flex-1 items-center justify-center py-12 relative z-10 pt-16 md:pt-24 px-4">
					<Card className="w-full max-w-md bg-ocean-card border-cyan-500/20 shadow-ocean">
						<CardHeader className="text-center">
							<CardTitle className="text-2xl font-bold text-white">Welcome to AdWhey</CardTitle>
							<CardDescription className="text-gray-300">
								{forgotPasswordMode 
									? "Reset your password" 
									: "Sign in to your account or create a new one"
								}
							</CardDescription>
						</CardHeader>
						
						<CardContent>
							{forgotPasswordMode ? (
								otpMode ? (
									<form onSubmit={handleOtpVerification} className={`space-y-4 ${shakeForm ? 'animate-shake' : ''}`}>
										<div className="text-center mb-6">
											<div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
												<Mail className="w-8 h-8 text-cyan-400" />
											</div>
											<h3 className="text-lg font-semibold text-white mb-2">Enter Verification Code</h3>
											<p className="text-gray-300 text-sm">
												We've sent a 6-digit code to <span className="text-cyan-400">{formData.email}</span>
											</p>
										</div>

										<div className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="otp-code" className="text-white">Verification Code</Label>
												<Input
													id="otp-code"
													type="text"
													value={otpCode}
													onChange={(e) => {
														setOtpCode(e.target.value);
														// Clear error when user starts typing
														if (errors.otpCode) {
															setErrors(prev => ({ ...prev, otpCode: undefined }));
														}
													}}
													className={`text-center text-lg font-mono bg-black/30 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 ${
														errors.otpCode ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' : ''
													}`}
													placeholder="Enter 6-digit code"
													maxLength={6}
													required
												/>
												{errors.otpCode && (
													<p className="text-sm text-red-400 flex items-center gap-1">
														<AlertCircle className="h-3 w-3" />
														{errors.otpCode}
													</p>
												)}
											</div>
										</div>
										
										<Button 
											type="submit" 
											className="w-full btn-ocean" 
											disabled={loading}
										>
											{loading ? (
												<>
													<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
													Verifying Code...
												</>
											) : (
												"Verify Code"
											)}
										</Button>
										
										<div className="flex gap-3">
											<Button 
												type="button" 
												variant="outline" 
												className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
												onClick={() => {
													setOtpMode(false);
													setPasswordCreationMode(false);
													setOtpCode("");
													setNewPassword("");
													setConfirmNewPassword("");
												}}
											>
												<ArrowLeft className="w-4 h-4 mr-2" />
												Back
											</Button>
											
											<Button 
												type="button" 
												variant="outline" 
												className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
												onClick={() => {
													setOtpMode(false);
													setPasswordCreationMode(false);
													setForgotPasswordMode(false);
													setOtpCode("");
													setNewPassword("");
													setConfirmNewPassword("");
													setFormData(prev => ({ ...prev, email: "" }));
												}}
											>
												Cancel
											</Button>
										</div>
									</form>
								) : passwordCreationMode ? (
									<form onSubmit={handlePasswordCreation} className={`space-y-4 ${shakeForm ? 'animate-shake' : ''}`}>
										<div className="text-center mb-6">
											<div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
												<Lock className="w-8 h-8 text-cyan-400" />
											</div>
											<h3 className="text-lg font-semibold text-white mb-2">Create New Password</h3>
											<p className="text-gray-300 text-sm">
												Your verification code has been verified. Please create a new password.
											</p>
										</div>

										<div className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="new-password" className="text-white">New Password</Label>
												<Input
													id="new-password"
													type="password"
													value={newPassword}
													onChange={(e) => {
														setNewPassword(e.target.value);
														// Clear error when user starts typing
														if (errors.newPassword) {
															setErrors(prev => ({ ...prev, newPassword: undefined }));
														}
													}}
													className={`bg-black/30 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 ${
														errors.newPassword ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' : ''
													}`}
													placeholder="Enter new password"
													required
												/>
												{errors.newPassword && (
													<p className="text-sm text-red-400 flex items-center gap-1">
														<AlertCircle className="h-3 w-3" />
														{errors.newPassword}
													</p>
												)}
											</div>

											<div className="space-y-2">
												<Label htmlFor="confirm-new-password" className="text-white">Confirm New Password</Label>
												<Input
													id="confirm-new-password"
													type="password"
													value={confirmNewPassword}
													onChange={(e) => {
														setConfirmNewPassword(e.target.value);
														// Clear error when user starts typing
														if (errors.confirmNewPassword) {
															setErrors(prev => ({ ...prev, confirmNewPassword: undefined }));
														}
													}}
													className={`bg-black/30 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 ${
														errors.confirmNewPassword ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' : ''
													}`}
													placeholder="Confirm new password"
													required
												/>
												{errors.confirmNewPassword && (
													<p className="text-sm text-red-400 flex items-center gap-1">
														<AlertCircle className="h-3 w-3" />
														{errors.confirmNewPassword}
													</p>
												)}
											</div>
										</div>
										
										<Button 
											type="submit" 
											className="w-full btn-ocean" 
											disabled={loading}
										>
											{loading ? (
												<>
													<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
													Updating Password...
												</>
											) : (
												"Update Password"
											)}
										</Button>
										
										<div className="flex gap-3">
											<Button 
												type="button" 
												variant="outline" 
												className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
												onClick={() => {
													setPasswordCreationMode(false);
													setOtpMode(true);
													setNewPassword("");
													setConfirmNewPassword("");
												}}
											>
												<ArrowLeft className="w-4 h-4 mr-2" />
												Back to OTP
											</Button>
											
											<Button 
												type="button" 
												variant="outline" 
												className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
												onClick={() => {
													setPasswordCreationMode(false);
													setForgotPasswordMode(false);
													setOtpCode("");
													setNewPassword("");
													setConfirmNewPassword("");
													setFormData(prev => ({ ...prev, email: "" }));
												}}
											>
												Cancel
											</Button>
										</div>
									</form>
								) : (
									<form onSubmit={handleForgotPassword} className="space-y-4">
										<div className="text-center mb-6">
											<div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
												<Mail className="w-8 h-8 text-cyan-400" />
											</div>
											<h3 className="text-lg font-semibold text-white mb-2">Reset Your Password</h3>
											<p className="text-gray-300 text-sm">
												Enter your email address and we'll send you a verification code to reset your password.
											</p>
										</div>

										<div className="space-y-2">
											<Label htmlFor="forgot-email" className="text-white">Email Address</Label>
											<div className="relative">
												<Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
												<Input
													id="forgot-email"
													type="email"
													value={formData.email}
													onChange={(e) => handleInputChange("email", e.target.value)}
													className={getFieldClassName("email", "pl-10 bg-black/30 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400")}
													placeholder="Enter your email"
													required
												/>
												{getFieldError("email") && (
													<AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
												)}
												{isEmailValid(formData.email) && (
													<CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
												)}
											</div>
											{getFieldError("email") && (
												<p className="text-sm text-red-400 flex items-center gap-1">
													<AlertCircle className="h-3 w-3" />
													{getFieldError("email")}
												</p>
											)}
										</div>
										
										<Button 
											type="submit" 
											className="w-full btn-ocean" 
											disabled={loading}
										>
											{loading ? (
												<>
													<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
													Sending Code...
												</>
											) : (
												"Send Verification Code"
											)}
										</Button>
										
										<Button 
											type="button" 
											variant="outline" 
											className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
											onClick={resetForgotPassword}
										>
											<ArrowLeft className="w-4 h-4 mr-2" />
											Back to Sign In
										</Button>
									</form>
								)
							) : (
								<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
									<TabsList className="grid w-full grid-cols-2 bg-black/30 border-cyan-500/30">
										<TabsTrigger 
											value="signin" 
											className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-300"
										>
											Sign In
										</TabsTrigger>
										<TabsTrigger 
											value="signup" 
											className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-300"
										>
											Sign Up
										</TabsTrigger>
									</TabsList>
									
									<TabsContent value="signin" className="space-y-4 mt-6">
										<form onSubmit={handleSignIn} className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="signin-email" className="text-white">Email</Label>
												<div className="relative">
													<Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
													<Input
														id="signin-email"
														type="email"
														value={formData.email}
														onChange={(e) => handleInputChange("email", e.target.value)}
														className={getFieldClassName("email", "pl-10 bg-black/30 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400")}
														placeholder="Enter your email"
														required
													/>
													{getFieldError("email") && (
														<AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
													)}
													{isEmailValid(formData.email) && (
														<CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
													)}
												</div>
												{getFieldError("email") && (
													<p className="text-sm text-red-400 flex items-center gap-1">
														<AlertCircle className="h-3 w-3" />
														{getFieldError("email")}
													</p>
												)}
											</div>
											
											<div className="space-y-2">
												<Label htmlFor="signin-password" className="text-white">Password</Label>
												<div className="relative">
													<Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
													<Input
														id="signin-password"
														type={showPassword ? "text" : "password"}
														value={formData.password}
														onChange={(e) => handleInputChange("password", e.target.value)}
														className={getFieldClassName("password", "pl-10 pr-10 bg-black/30 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400")}
														placeholder="Enter your password"
														required
													/>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
														onClick={() => setShowPassword(!showPassword)}
													>
														{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
													</Button>
													{getFieldError("password") && (
														<AlertCircle className="absolute right-12 top-3 h-4 w-4 text-red-500" />
													)}
													{isPasswordValid(formData.password) && (
														<CheckCircle className="absolute right-12 top-3 h-4 w-4 text-green-500" />
													)}
												</div>
												{getFieldError("password") && (
													<p className="text-sm text-red-400 flex items-center gap-1">
														<AlertCircle className="h-3 w-3" />
														{getFieldError("password")}
													</p>
												)}
											</div>
											
											<div className="flex items-center justify-between">
												<Button 
													type="button" 
													variant="link" 
													className="text-cyan-400 hover:text-cyan-300 p-0 h-auto"
													onClick={() => setForgotPasswordMode(true)}
												>
													Forgot password?
												</Button>
											</div>
											
											<Button 
												type="submit" 
												className="w-full btn-ocean" 
												disabled={loading}
											>
												{loading ? (
													<>
														<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
														Signing in...
													</>
												) : (
													"Sign In"
												)}
											</Button>

											<div className="relative">
												<div className="absolute inset-0 flex items-center">
													<span className="w-full border-t border-cyan-500/30" />
												</div>
												<div className="relative flex justify-center text-xs uppercase">
													<span className="bg-ocean-card px-2 text-gray-400">Or continue with</span>
												</div>
											</div>

											<Button
												type="button"
												variant="outline"
												className="w-full border-cyan-500/30 text-white hover:bg-cyan-500/10 hover:text-white"
												onClick={handleGoogleSignIn}
												disabled={loading}
											>
												{loading ? (
													<>
														<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
														Signing in...
													</>
												) : (
													<>
														<FcGoogle className="w-4 h-4 mr-2" />
														Sign in with Google
													</>
												)}
											</Button>
										</form>
									</TabsContent>
									
									<TabsContent value="signup" className="space-y-4 mt-6">
										<form onSubmit={handleSignUp} className={`space-y-4 ${shakeForm ? 'animate-shake' : ''}`}>
											<div className="space-y-2">
												<Label htmlFor="signup-name" className="text-white">Full Name</Label>
												<div className="relative">
													<User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
													<Input
														id="signup-name"
														type="text"
														value={formData.fullName}
														onChange={(e) => handleInputChange("fullName", e.target.value)}
														className={getFieldClassName("fullName", "pl-10 bg-black/30 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400")}
														placeholder="Enter your full name"
														required
													/>
													{getFieldError("fullName") && (
														<AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
													)}
													{isFullNameValid(formData.fullName) && (
														<CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
													)}
												</div>
												{getFieldError("fullName") && (
													<p className="text-sm text-red-400 flex items-center gap-1">
														<AlertCircle className="h-3 w-3" />
														{getFieldError("fullName")}
													</p>
												)}
											</div>
											
											<div className="space-y-2">
												<Label htmlFor="signup-email" className="text-white">Email</Label>
												<div className="relative">
													<Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
													<Input
														id="signup-email"
														type="email"
														value={formData.email}
														onChange={(e) => handleInputChange("email", e.target.value)}
														className={getFieldClassName("email", "pl-10 bg-black/30 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400")}
														placeholder="Enter your email"
														required
													/>
													{getFieldError("email") && (
														<AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
													)}
													{isEmailValid(formData.email) && (
														<CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
													)}
												</div>
												{getFieldError("email") && (
													<p className="text-sm text-red-400 flex items-center gap-1">
														<AlertCircle className="h-3 w-3" />
														{getFieldError("email")}
													</p>
												)}
											</div>
											
											<div className="space-y-2">
												<Label htmlFor="signup-password" className="text-white">Password</Label>
												<div className="relative">
													<Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
													<Input
														id="signup-password"
														type={showPassword ? "text" : "password"}
														value={formData.password}
														onChange={(e) => handleInputChange("password", e.target.value)}
														className={getFieldClassName("password", "pl-10 pr-10 bg-black/30 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400")}
														placeholder="Create a password"
														required
													/>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
														onClick={() => setShowPassword(!showPassword)}
													>
														{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
													</Button>
													{getFieldError("password") && (
														<AlertCircle className="absolute right-12 top-3 h-4 w-4 text-red-500" />
													)}
													{isPasswordValid(formData.password) && (
														<CheckCircle className="absolute right-12 top-3 h-4 w-4 text-green-500" />
													)}
												</div>
												{getFieldError("password") && (
													<p className="text-sm text-red-400 flex items-center gap-1">
														<AlertCircle className="h-3 w-3" />
														{getFieldError("password")}
													</p>
												)}
											</div>
											
											<div className="space-y-2">
												<Label htmlFor="signup-confirm-password" className="text-white">Confirm Password</Label>
												<div className="relative">
													<Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
													<Input
														id="signup-confirm-password"
														type={showConfirmPassword ? "text" : "password"}
														value={formData.confirmPassword}
														onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
														className={getFieldClassName("confirmPassword", "pl-10 pr-10 bg-black/30 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400")}
														placeholder="Confirm your password"
														required
													/>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
														onClick={() => setShowConfirmPassword(!showConfirmPassword)}
													>
														{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
													</Button>
													{getFieldError("confirmPassword") && (
														<AlertCircle className="absolute right-12 top-3 h-4 w-4 text-red-500" />
													)}
													{formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 && (
														<CheckCircle className="absolute right-12 top-3 h-4 w-4 text-green-500" />
													)}
												</div>
												{getFieldError("confirmPassword") && (
													<p className="text-sm text-red-400 flex items-center gap-1">
														<AlertCircle className="h-3 w-3" />
														{getFieldError("confirmPassword")}
													</p>
												)}
											</div>
											
											<Button 
												type="submit" 
												className="w-full btn-ocean" 
												disabled={loading}
											>
												{loading ? (
													<>
														<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
														Creating account...
													</>
												) : (
													"Create Account"
												)}
											</Button>

											<div className="relative">
												<div className="absolute inset-0 flex items-center">
													<span className="w-full border-t border-cyan-500/30" />
												</div>
												<div className="relative flex justify-center text-xs uppercase">
													<span className="bg-ocean-card px-2 text-gray-400">Or continue with</span>
												</div>
											</div>

											<Button
												type="button"
												variant="outline"
												className="w-full border-cyan-500/30 text-white hover:bg-cyan-500/10 hover:text-white"
												onClick={handleGoogleSignIn}
												disabled={loading}
											>
												{loading ? (
													<>
														<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
														Creating account...
													</>
												) : (
													<>
														<FcGoogle className="w-4 h-4 mr-2" />
														Sign up with Google
													</>
												)}
											</Button>
										</form>
									</TabsContent>
								</Tabs>
							)}
						</CardContent>
					</Card>
				</main>
				
				<Footer />
			</div>
		</>
	);
};

export default Auth;
