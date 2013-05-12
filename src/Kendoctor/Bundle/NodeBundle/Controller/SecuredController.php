<?php

namespace Kendoctor\Bundle\NodeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\Security\Core\SecurityContext;

use Kendoctor\Bundle\NodeBundle\Form\UserType;
use Kendoctor\Bundle\NodeBundle\Entity\User;

class SecuredController extends Controller
{
    /**
     * @Route("/login", name="login")
     * @Template()
     */
    public function loginAction()
    {
        $request = $this->getRequest();
        $session = $request->getSession();
        
        if($request->attributes->has(SecurityContext::AUTHENTICATION_ERROR))
        {
            $error = $request->get(SecurityContext::AUTHENTICATION_ERROR);
        }else {
            $error = $session->get(SecurityContext::AUTHENTICATION_ERROR);
            $session->remove(SecurityContext::AUTHENTICATION_ERROR);                    
        }
        
        
        return array(
            'error' => $error,
            'last_username' => $session->get(SecurityContext::LAST_USERNAME)
        );
    }
    
    /**
     * @Route("/login_check", name="login_check")
     */
    public function loginCheckAction()
    {
       
    }
    
     /**
     * @Route("/logout", name="logout")
     */
    public function logoutAction()
    {
        
    }
    
    /**
     * @Route("/register", name="register")
     * @Template()
     */
    public function registerAction()
    {
      //  $a = new \Symfony\Component\Security\Core\SecurityContext();
        $securityContext = $this->get('security.context');        

        if($securityContext->getToken() !== null)
        {
            return $this->redirect($this->generateUrl("homepage"));
        }
        
        $user = new User();
        $form = $this->createForm(new UserType(), $user);
        $request = $this->getRequest();
        if($request->getMethod() == "POST")
        {
            $form->bind($request);
            if($form->isValid())
            {
                $factory = $this->get('security.encoder_factory');
                $em = $this->getDoctrine()->getManager();
                $encoder = $factory->getEncoder($user);
                $password = $encoder->encodePassword($user->getPassword(), $user->getSalt());
                $user->setPassword($password);
                $em->persist($user);
                $em->flush();
                return $this->redirect($this->generateUrl("homepage"));
            }
        }
        
        return array(
            'form' => $form->createView()
        );
   
        
    }
    
    
}
